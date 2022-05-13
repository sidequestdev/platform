import parseFrontMatter from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import invariant from "tiny-invariant";
import { TableOfContents } from "~/components/TableOfContents";
import { DirectoryEntry, directoryTree } from "~/lib/directory-tree";
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

  const mdx = await bundleMDX({
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

  const walker = (
    tree: NonNullable<Awaited<ReturnType<typeof directoryTree>>>
  ) => {
    if (tree.type === "directory") {
      // read in metadata.json
      return {
        label: tree.name,
        links: tree.children.map(walker),
      };
    } else if (tree.type === "file") {
      // read in frontmatter

      return {
        label: tree.name,
        link: `/courses/${tree.path
          .replace(`${coursesPath}/`, "")
          .replace(/\.(md|mdx)$/i, "")}`,
      };
    }
  };

  const tableOfContents = walker(course);

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
