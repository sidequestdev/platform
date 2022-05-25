import type { Element, Root } from "hast";
import getImageSize from "image-size";
import path from "node:path";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const rehypeBase64Image: Plugin<[], Root> = () => {
  return (tree, file) => {
    visit(tree, { type: "element", tagName: "img" }, (node: Element) => {
      if (typeof node.properties?.src !== "string") {
        return;
      }

      const imagePath = path.join(process.cwd(), "public", node.properties.src);
      const imageSize = getImageSize(imagePath);

      node.properties.width = imageSize.width;
      node.properties.height = imageSize.height;
    });
  };
};

export default rehypeBase64Image;
