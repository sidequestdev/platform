import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ComponentMap } from "mdx-bundler/client";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import invariant from "tiny-invariant";
import { Code } from "~/components/Code";
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

const MDXComponents: ComponentMap = {
  code: Code,
};

interface CourseShellProps {
  page: Awaited<ReturnType<typeof getMdxPage>>;
}

export function CourseShell({ page }: CourseShellProps) {
  const Component = React.useMemo(
    () => getMDXComponent(page.code),
    [page.code]
  );

  return <Component components={MDXComponents} />;
}

export default function Course() {
  const page = useLoaderData<Awaited<ReturnType<typeof getMdxPage>>>();

  return <CourseShell page={page} />;
}
