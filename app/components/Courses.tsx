import {
  Anchor,
  Container,
  createStyles,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import flappyBirdCover from "../images/flappy-bird.png";
import gameOfLifeCover from "../images/game-of-life.png";
import spaceEatersCover from "../images/space-eaters.png";
import { CourseCard } from "./CourseCard";

const MOCK_COURSES = [
  {
    image: flappyBirdCover,
    title: "Flappy Bird",
    premium: true,
    link: "/courses/flappy-bird/welcome",
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
  },
  {
    image: spaceEatersCover,
    title: "Space Eaters",
    premium: true,
    link: "/courses/space-eaters",
    description:
      "Create a top down shooter with enemy patterns, scene manangement, ECS and more.",
    stats: [
      {
        title: "Reading Time",
        value: "5h",
      },
      {
        title: "Difficulty",
        value: "Intermediate",
      },
    ],
  },
  {
    image: gameOfLifeCover,
    title: "Game of Life",
    link: "/courses/game-of-life",
    description:
      "Conway's Game of Life is a classic cellular automaton. We'll recreate the simulation entirely in the canvas.",
    stats: [
      {
        title: "Reading Time",
        value: "2h",
      },
      {
        title: "Difficulty",
        value: "Beginner",
      },
    ],
  },
];

interface CourseProps {
  image: string;
  title: string;
  premium?: boolean;
  description: string;
  link: string;
  stats: Array<{ title: string; value: string }>;
}

const useStyles = createStyles((theme) => ({
  containerWrapper: {
    position: "relative",
    boxSizing: "border-box",
  },

  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
    },
  },
}));

interface CoursesComponentProps {
  data?: CourseProps[];
  description: React.ReactNode;
  title: React.ReactNode;
}

export function Courses({
  title,
  description,
  data = MOCK_COURSES,
}: CoursesComponentProps) {
  const { classes } = useStyles();

  const courses = MOCK_COURSES.map((course, index) => (
    <Grid.Col sm={12} md={4} key={index}>
      <Container size={350}>
        <Anchor href={course.link} style={{ textDecoration: "none" }}>
          <CourseCard {...course} />
        </Anchor>
      </Container>
    </Grid.Col>
  ));

  return (
    <div className={classes.containerWrapper}>
      <Container className={classes.wrapper}>
        <Title className={classes.title} id="courses">
          {title}
        </Title>

        <Container size={560} p={0}>
          <Text size="sm" className={classes.description}>
            {description}
          </Text>
        </Container>

        <Container size={950} mt={60}>
          <Grid grow>{courses}</Grid>
        </Container>
      </Container>
    </div>
  );
}
