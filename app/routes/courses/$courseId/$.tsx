import { Aside, Grid, MediaQuery } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import invariant from "tiny-invariant";
import { MDXComponents } from "~/components/MDXComponents";
import { TableOfContents } from "~/components/TableOfContents";
import { getMdxPage } from "~/courses/course.server";

export const loader = async ({ params }: LoaderArgs) => {
  try {
    invariant(params.courseId, "expected params.courseId");
    invariant(params["*"], "expected params.*");

    const page = await getMdxPage(`${params.courseId}/${params["*"]}`);

    return page;
  } catch (error) {
    console.error(error);

    throw new Response("Not Found", {
      status: 404,
    });
  }
};

export default function Course() {
  const page = useLoaderData<typeof loader>();

  const Component = React.useMemo(
    () => getMDXComponent(page.code),
    [page.code]
  );

  // Ignore H1 headers
  const tableOfContents = page.pageTableOfContents
    .filter((item) => item.depth !== 1)
    .map((item) => ({
      label: item.value,
      link: item.url,
      order: item.depth,
    }));

  return (
    <Grid>
      <Grid.Col md={12} lg={11}>
        <Component components={MDXComponents} />
      </Grid.Col>

      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
        <Grid.Col md={1}>
          <Aside
            p="lg"
            hiddenBreakpoint="md"
            width={{ md: 350 }}
            styles={{
              root: {
                background: "transparent",
                borderLeft: "none",
              },
            }}
          >
            {tableOfContents.length > 0 ? (
              <TableOfContents slug={page.slug} links={tableOfContents} />
            ) : null}
          </Aside>
        </Grid.Col>
      </MediaQuery>
    </Grid>
  );
}
