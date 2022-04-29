import parseFrontMatter from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import invariant from "tiny-invariant";

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

export async function getMdxPost(slug: string) {
  const [
    rehypePrism,
    rehypeCodeTitles,
    rehypeSlug,
    rehypeAutoLinkHeadings,
    rehypeToc,
  ] = await Promise.all([
    import("rehype-prism-plus").then((mod) => mod.default),
    import("rehype-code-titles").then((mod) => mod.default),
    import("rehype-slug").then((mod) => mod.default),
    import("rehype-autolink-headings").then((mod) => mod.default),
    import("rehype-toc").then((mod) => mod.default),
  ]);

  const filepath = path.join(coursesPath, `${slug}.mdx`);

  const { code, frontmatter } = await bundleMDX({
    file: filepath,
    cwd: coursesPath,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutoLinkHeadings,
        rehypeToc,
        // This must come before rehype-prism-plus
        rehypeCodeTitles,
        rehypePrism,
      ];

      return options;
    },
  });

  // invariant(
  //   isValidPostAttributes(attributes),
  //   `Post ${filepath} is missing attributes`,
  // );

  // const html = marked(body);

  return { slug, html: code, code, title: frontmatter.title };
}
