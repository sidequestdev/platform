import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const rehypeCodeDetails: Plugin<[], Root> = () => {
  return (tree, file) => {
    // XXX Not sure if the `Element` type annotation is even necessary.
    visit(tree, { type: "element", tagName: "code" }, (node: Element) => {
      // if className is empty, it's an inline code block
      // if (node.properties?.className == null) {
      //   return;
      // }

      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
      console.dir(node, { depth: null, colors: true });
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    });
  };
};

export default rehypeCodeDetails;
