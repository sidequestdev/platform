import { Image } from "@mantine/core";
import React from "react";

export const Paragraph = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
) => {
  if (
    props.children &&
    typeof props.children === "object" &&
    "type" in props.children &&
    props.children.type === "img"
  ) {
    return <Image {...props.children.props} fit="contain" height={305} />;
  }

  return <p {...props} />;
};
