import { Anchor } from "@mantine/core";
import type { ComponentMap } from "mdx-bundler/client";
import { Code } from "./Code";
import { Directive } from "./Directive";
import { Paragraph } from "./Paragraph";

export const MDXComponents: ComponentMap = {
  a: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
  ) => <Anchor>{props.children}</Anchor>,
  code: Code,
  div: Directive,
  // img: (
  //   props: React.DetailedHTMLProps<
  //     React.ImgHTMLAttributes<HTMLImageElement>,
  //     HTMLImageElement
  //   >
  // ) => {
  //   console.log(props);

  //   return <Image {...props} ref={null} withPlaceholder />;
  // },
  p: Paragraph,
};
