import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Courses } from "~/components/Courses";
import { Features } from "~/components/Features";
import { Hero } from "~/components/Hero";
import { getCourses } from "~/courses/course.server";

export const loader: LoaderFunction = async () => {
  return json({ courses: await getCourses() });
};

export default function Index() {
  const courses = useLoaderData();

  return (
    <>
      <Hero />
      <Features
        title="Integrate effortlessly with any technology stack"
        description="Every once in a while, you'll see a Golbat that's missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon."
      />
      <Courses title="Courses" description="Choose your path" />
    </>
  );
}
