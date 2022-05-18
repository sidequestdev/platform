import { h } from "hastscript";
import { visit } from "unist-util-visit";

/** @type {import('unified').Plugin<[], import('mdast').Root>} */
export function remarkAlert() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "alert") return;

        const data = node.data || (node.data = {});
        const tagName = node.type === "textDirective" ? "span" : "div";

        data.hName = tagName;
        data.hProperties = h(tagName, node.attributes).properties;
      }
    });
  };
}
