import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const isElementWithMetadata = (
  node: Element
): node is Element & {
  data: NonNullable<Element["data"]> & { meta: string };
} => typeof node.data === "object" && "meta" in node.data;

const titleRegExp = /title="(?<title>(.*))"/i;

const rehypeCodeDetails: Plugin<[], Root> = () => {
  return (tree, file) => {
    // XXX Not sure if the `Element` type annotation is even necessary.
    visit(tree, { type: "element", tagName: "code" }, (node: Element) => {
      // if className is empty, it's an inline code block
      if (node.properties?.className == null) {
        return;
      }

      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      console.dir(node, { depth: null, colors: true });
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");

      if (isElementWithMetadata(node)) {
        const title = node.data.meta.match(titleRegExp)?.groups?.title;

        node.properties["data-title"] = title;
      }
    });
  };
};

export default rehypeCodeDetails;
