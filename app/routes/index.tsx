import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import App from "~/components/App";
import { getCourses } from "~/courses/course.server";

export const loader: LoaderFunction = async () => {
  console.log(await getCourses());

  return json({ courses: await getCourses() });
};

export default function Index() {
  const courses = useLoaderData();

  return <App />;
}
