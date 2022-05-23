import { Alert, Anchor, Image } from "@mantine/core";
import type { ComponentMap } from "mdx-bundler/client";
import { AlertCircle } from "tabler-icons-react";
import { AlertInfo } from "./Alerts/AlertInfo";
import { AlertTip } from "./Alerts/AlertTip";
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
  img: (
    props: React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >
  ) => {
    return (
      <Image
        {...props}
        ref={null}
        fit="contain"
        height={parseInt(`${props.height}`)}
        style={{
          margin: "24px 0",
        }}
      />
    );
  },
  p: Paragraph,
  // @ts-ignore
  Alert,
  // @ts-ignore
  AlertCircle,

  // Alerts
  // @ts-ignore
  AlertInfo,
  // @ts-ignore
  AlertTip,
};
