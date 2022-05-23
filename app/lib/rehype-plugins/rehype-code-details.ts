import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const isElementWithMetadata = (
  node: Element
): node is Element & {
  data: NonNullable<Element["data"]> & { meta: string };
} => typeof node.data === "object" && "meta" in node.data;

const titleRegExp = /title="(?<title>(.*))"/i;

/**
 * Should be in the format `+{1,2-10,12}` to add lines
 */
const linesAddedRegExp = /\+{(?<lines>[0-9,-]*)}/i;

const rehypeCodeDetails: Plugin<[], Root> = () => {
  return (tree, file) => {
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
        if (title != null) {
          node.properties["data-title"] = title;
        }

        const linesAdded =
          node.data.meta.match(linesAddedRegExp)?.groups?.lines;

        if (linesAdded != null) {
          const lines = linesAdded
            .split(",")
            .map((numStr) => numStr.trim())
            .flatMap((input) => {
              const numbers = input.split("-");

              if (numbers[0] === input) {
                return parseInt(input);
              }

              const [start, end] = numbers.map((number) => parseInt(number));

              return Array.from(
                { length: end - start + 1 },
                (_, key) => start + key
              );
            })
            .sort((a, b) => a - b);

          node.properties["data-lines-added"] = lines;
        }
      }
    });
  };
};

export default rehypeCodeDetails;
