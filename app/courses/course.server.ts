import { default as fm } from "front-matter";
import { bundleMDX } from "mdx-bundler";
import fs from "node:fs/promises";
import path from "node:path";
import remarkDirective from "remark-directive";
import invariant from "tiny-invariant";
import yaml from "yaml";
import { directoryTree } from "~/lib/directory-tree";
import { remarkAlert } from "~/lib/remark-plugins/remark-alert";
import type { RemarkTableOfContentsItem } from "~/lib/remark-plugins/remark-toc";
import remarkToc from "~/lib/remark-plugins/remark-toc";

process.env.ESBUILD_BINARY_PATH = path.join(
  process.cwd(),
  "node_modules",
  "esbuild",
  "bin",
  "esbuild"
);

// relative to the server output, not the source!
const coursesPath = path.join(__dirname, "..", "courses");

export async function getCourses() {
  const dir = await fs.readdir(coursesPath);

  return dir;
}

export type ToCItem = {
  label: string;
  link: string;
  position: number;
  type: "file";
};

export type ToCDirectory = {
  label: string;
  links: Array<ToCItem | ToCDirectory>;
  position: number;
  type: "directory";
};

export async function getMdxPage(slug: string) {
  const courseId = slug.split("/").shift();

  const courses = await directoryTree(coursesPath, {
    attributes: ["size", "extension", "type"],
    extensions: /\.mdx?$/,
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
        remarkDirective,
        remarkAlert,
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
      const metadataFilePath = path.join(tree.path, "metadata.yaml");

      const metadata: {
        label: string;
        position: number;
        // await fs.readFile(metadataFilePath, "utf8"); is getting
        // converted to `await import()` which requires json assert
      } = yaml.parse(await fs.readFile(metadataFilePath, "utf8"));

      return {
        label: metadata.label,
        links: await Promise.all(tree.children.map(walker)).then((links) =>
          links.sort((a, b) => a.position - b.position)
        ),
        position: metadata.position,
        type: "directory",
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
        type: "file",
      };
    }

    throw new Error("Invalid tree type");
  };

  const tableOfContents = await walker(course);

  return {
    slug,
    html: code,
    code,
    title: frontmatter.title,
    pageTableOfContents,
    tableOfContents,
  };
}
