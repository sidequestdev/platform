import { Alert, Aside, Grid, MediaQuery } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ComponentMap } from "mdx-bundler/client";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import { AlertCircle } from "tabler-icons-react";
import invariant from "tiny-invariant";
import { Code } from "~/components/Code";
import { TableOfContents } from "~/components/TableOfContents";
import { getMdxPage } from "~/courses/course.server";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    // invariant(params.courseId, "expected params.courseId");
    invariant(params["*"], "expected params.*");

    // const courseId = params.courseId;
    // const slug = `${courseId}/${params["*"]}`;

    const page = await getMdxPage(params["*"]);

    return page;
  } catch (error) {
    console.error(error);

    throw new Response("Not Found", {
      status: 404,
    });
  }
};

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    type?: string;
  }
}

const MDXComponents: ComponentMap = {
  code: Code,
  // TODO - clean this shit up
  div: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  ) => {
    if (props.type === "info") {
      return (
        <Alert
          icon={<AlertCircle size={24} />}
          title={props.title}
          color="cyan"
        >
          {props.children}
        </Alert>
      );
    }

    return <div {...props} />;
  },
};

export default function Course() {
  const page = useLoaderData<Awaited<ReturnType<typeof getMdxPage>>>();

  const Component = React.useMemo(
    () => getMDXComponent(page.code),
    [page.code]
  );

  return (
    <Grid>
      <Grid.Col md={12} lg={11}>
        <Component components={MDXComponents} />
      </Grid.Col>

      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
        <Grid.Col lg={1}>
          <Aside
            p="md"
            hiddenBreakpoint="md"
            width={{ md: 300 }}
            styles={{
              root: {
                background: "transparent",
                borderLeft: "none",
              },
            }}
          >
            <TableOfContents
              slug={page.slug}
              links={page.pageTableOfContents.map((item) => ({
                label: item.value,
                link: item.url,
                order: item.depth,
              }))}
            />
          </Aside>
        </Grid.Col>
      </MediaQuery>
    </Grid>
  );
}
