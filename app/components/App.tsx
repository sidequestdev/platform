import { Container, Grid, SimpleGrid } from "@mantine/core";
import React from "react";
import { Course } from "./Course";
import { Courses } from "./Courses";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { HeaderResponsive } from "./Header";
import { Hero } from "./Hero";

const links = [
  {
    link: "/courses",
    label: "Courses",
  },
  {
    link: "/blog",
    label: "Blog",
  },
];

const footerData = [
  {
    title: "About",
    links: [
      {
        label: "Features",
        link: "#",
      },
      {
        label: "Pricing",
        link: "#",
      },
      {
        label: "Support",
        link: "#",
      },
      {
        label: "Forums",
        link: "#",
      },
    ],
  },
  {
    title: "Project",
    links: [
      {
        label: "Contribute",
        link: "#",
      },
      {
        label: "Media assets",
        link: "#",
      },
      {
        label: "Changelog",
        link: "#",
      },
      {
        label: "Releases",
        link: "#",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Join Discord",
        link: "#",
      },
      {
        label: "Follow on Twitter",
        link: "#",
      },
      {
        label: "Email newsletter",
        link: "#",
      },
      {
        label: "GitHub discussions",
        link: "#",
      },
    ],
  },
];

const MOCK_COURSE = {
  image: "https://i.ibb.co/3YzkGw3/flappy-bird.png",
  title: "Flappy Bird",
  description:
    "Recreate the classic Flappy Bird game, with a focus on the physics and gameplay.",
  stats: [
    {
      title: "Reading Time",
      value: "3h",
    },
    {
      title: "Difficulty",
      value: "Beginner",
    },
  ],
};

export default function App() {
  return (
    <>
      <HeaderResponsive links={links} />
      <Hero />
      <Features
        title="Integrate effortlessly with any technology stack"
        description="Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon."
      />
      <Courses title="Courses" description="Choose your path" />

      <Container size={950}>
        <Grid grow>
          <Grid.Col sm={12} md={4}>
            <Container size={350}>
              <Course {...MOCK_COURSE} />
            </Container>
          </Grid.Col>

          <Grid.Col sm={12} md={4}>
            <Container size={350}>
              <Course {...MOCK_COURSE} />
            </Container>
          </Grid.Col>

          <Grid.Col sm={12} md={4}>
            <Container size={350}>
              <Course {...MOCK_COURSE} />
            </Container>
          </Grid.Col>
        </Grid>
      </Container>

      <Footer data={footerData} />
    </>
  );
}
