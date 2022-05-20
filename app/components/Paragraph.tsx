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
    (props.children.type === "img" ||
      props.children?.props.src.includes("data:image"))
  ) {
    return <>{props.children}</>;
  }

  return <p {...props} />;
};
