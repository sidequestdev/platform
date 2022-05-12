import slugger from "github-slugger";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

export type RemarkTableOfContentsItem = {
  value: string;
  url: string;
  depth: number;
};

interface RemarkTocOptions {
  exportRef: RemarkTableOfContentsItem[];
}

export default function remarkToc(options: RemarkTocOptions) {
  return (tree: any) =>
    visit(tree, "heading", (node, index, parent) => {
      const textContent = toString(node);
      options.exportRef.push({
        value: textContent,
        url: "#" + slugger.slug(textContent),
        depth: node.depth,
      });
    });
}
