import { Code as InlineCode } from "@mantine/core";
import type { PrismProps } from "@mantine/prism";
import { Prism } from "@mantine/prism";
import type { PrismSharedProps } from "@mantine/prism/lib/types";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { ComponentMap } from "mdx-bundler/client";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import invariant from "tiny-invariant";
import { getMdxPage } from "~/courses/course.server";

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params);

  invariant(params["*"], "expected params.*");

  const slug = params["*"];

  return getMdxPage(slug);
};

const Code = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  console.log(props);

  const { className, children } = props;

  // If there is no className, this in an inline code block.
  // e.g. `const foo = "bar";`
  if (className == null) {
    return <InlineCode>{children}</InlineCode>;
  }

  invariant(className, "expected className");
  invariant(typeof children === "string", "expected children");

  const language: PrismSharedProps["language"] | undefined = className
    ?.split(":")[0]
    ?.split("-")
    .pop() as PrismSharedProps["language"];

  invariant(language, "expected language");

  const title = className?.split(":")[1];

  const options: PrismProps = {
    children,
    language,
    withLineNumbers: true,
  };

  return (
    <Prism
      {...options}
      styles={{
        code: {
          border: "1px solid #aaa",
          fontSize: "14px",
        },
      }}
    />
  );
};

const MDXComponents: ComponentMap = {
  code: Code,
};

export default function CourseSplat() {
  const page = useLoaderData();
  console.log(page);

  const Component = React.useMemo(
    () => getMDXComponent(page.code),
    [page.code]
  );

  return <Component components={MDXComponents} />;
}
