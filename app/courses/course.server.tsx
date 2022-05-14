import { default as fm, default as parseFrontMatter } from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import invariant from "tiny-invariant";
import { directoryTree } from "~/lib/directory-tree";
import type { RemarkTableOfContentsItem } from "~/lib/remark-plugins/remark-toc";
import remarkToc from "~/lib/remark-plugins/remark-toc";

process.env.ESBUILD_BINARY_PATH = path.join(
  process.cwd(),
  "node_modules",
  "esbuild",
  "bin",
  "esbuild"
);

export type Post = {
  slug: string;
  title: string;
  html: string;
  code?: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

// relative to the server output, not the source!
const coursesPath = path.join(__dirname, "..", "courses");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getCourses() {
  const dir = await fs.readdir(coursesPath);

  return dir;
}

export async function getPosts() {
  const dir = await fs.readdir(coursesPath);

  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(coursesPath, filename), "utf8");
      const { attributes } = parseFrontMatter(file.toString());

      invariant(
        isValidPostAttributes(attributes),
        `${filename} is not a valid post`
      );

      return {
        slug: filename.replace(".md", ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string) {
  const filepath = path.join(coursesPath, `${slug}.md`);
  const file = await fs.readFile(filepath, "utf8");
  const { attributes, body } = parseFrontMatter(file.toString());

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  const html = marked(body);

  return { slug, html, title: attributes.title };
}

type ToCItem = {
  label: string;
  link: string;
  position: number;
};

type ToCDirectory = {
  label: string;
  links: Array<ToCItem | ToCDirectory>;
  position: number;
};

export async function getMdxPage(slug: string) {
  console.log({ slug });

  const courseId = slug.split("/").shift();

  const courses = await directoryTree(coursesPath, {
    attributes: ["size", "extension", "type"],
  });

  invariant(courses?.type === "directory");

  const course = courses?.children.find((course) => course.name === courseId);
  invariant(course, `Could not find course ${courseId}`);
  invariant(course.type === "directory");

  const [rehypeCodeTitles, rehypeSlug, rehypeAutoLinkHeadings] =
    await Promise.all([
      import("rehype-code-titles").then((mod) => mod.default),
      import("rehype-slug").then((mod) => mod.default),
      import("rehype-autolink-headings").then((mod) => mod.default),
    ]);

  const filepath = path.join(coursesPath, `${slug}.mdx`);

  const pageTableOfContents: Array<RemarkTableOfContentsItem> = [];

  const mdx = await bundleMDX<{
    sidebar_position: number;
    title?: string;
    description?: string;
  }>({
    file: filepath,
    cwd: coursesPath,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkToc, { exportRef: pageTableOfContents }],
      ];

      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutoLinkHeadings,
        rehypeCodeTitles,
      ];

      return options;
    },
  });

  const { code, frontmatter } = mdx;

  const walker = async (
    tree: NonNullable<Awaited<ReturnType<typeof directoryTree>>>
  ): Promise<ToCItem | ToCDirectory> => {
    if (tree.type === "directory") {
      // read in metadata.json
      const metadataFilePath = path.join(tree.path, "metadata.json");

      const metadata: {
        label: string;
        position: number;
      } = JSON.parse(await fs.readFile(metadataFilePath, "utf8"));

      return {
        label: metadata.label,
        links: await Promise.all(tree.children.map(walker)),
        position: metadata.position,
      };
    } else if (tree.type === "file") {
      // read in frontmatter
      const { attributes } = fm<{
        sidebar_position: number;
        title: string;
        description?: string;
      }>(await fs.readFile(tree.path, "utf8"));

      return {
        label: attributes.title,
        link: `/courses/${tree.path
          .replace(`${coursesPath}/`, "")
          .replace(/\.(md|mdx)$/i, "")}`,
        position: attributes.sidebar_position,
      };
    }

    throw new Error("Invalid tree type");
  };

  const tableOfContents = await walker(course);

  console.log(JSON.stringify(tableOfContents, null, 2));

  return {
    slug,
    html: code,
    code,
    title: frontmatter.title,
    pageTableOfContents,
    tableOfContents,
  };
}
