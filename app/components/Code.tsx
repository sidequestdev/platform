import { Code as InlineCode } from "@mantine/core";
import type { PrismProps } from "@mantine/prism";
import { Prism } from "@mantine/prism";
import type { PrismSharedProps } from "@mantine/prism/lib/types";
import React from "react";
import invariant from "tiny-invariant";
import { SiTypescript } from "react-icons/si";

interface CodeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  "data-title"?: string;
}

export const Code = (props: CodeProps) => {
  const { className, children } = props;

  // If there is no className, this in an inline code block.
  // e.g. `const foo = "bar";`
  if (className == null) {
    return <InlineCode>{children}</InlineCode>;
  }

  console.log("<Code>", props, props["data-title"]);

  invariant(className, "expected className");
  invariant(typeof children === "string", "expected children");

  const language: PrismSharedProps["language"] | undefined = className
    ?.split(":")[0]
    ?.split("-")
    .pop() as PrismSharedProps["language"];

  invariant(language, "expected language");

  const options: PrismProps = {
    children,
    language,
    withLineNumbers: true,
  };

  const styles = {
    code: {
      border: "1px solid #aaa",
      fontSize: "14px",
    },
  };

  const title = props["data-title"];

  if (title != null) {
    return (
      <Prism.Tabs
        styles={{
          ...styles,
          tab: {
            ...styles.code,
            borderBottom: 0,
          },
        }}
      >
        <Prism.Tab
          language={language}
          withLineNumbers
          label={title}
          icon={<SiTypescript />}
        >
          {children}
        </Prism.Tab>
      </Prism.Tabs>
    );
  }

  return <Prism {...options} styles={styles} />;
};
