import {
  Container,
  createStyles,
  Grid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import type { Icon as TablerIcon } from "tabler-icons-react";
import { DeviceGamepad } from "tabler-icons-react";
import { Course } from "./Course";

const MOCKDATA = [
  {
    icon: DeviceGamepad,
    title: "Flappy Bird",
    description:
      "We'll recreate the classis Flappy Bird game, with a focus on the physics and gameplay.",
  },
];

const MOCK_COURSES = [
  {
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
  },
  {
    image: "https://i.ibb.co/j4nNPXn/space-eaters.png",
    title: "Space Eaters",
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
    image: "https://i.ibb.co/7JrNRXC/game-of-life.png",
    title: "Game of Life",
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
  icon: TablerIcon;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function CourseOld({ icon: Icon, title, description }: CourseProps) {
  const theme = useMantineTheme();

  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{ width: 20, height: 20 }} />
      </ThemeIcon>
      <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>
        {title}
      </Text>
      <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </div>
  );
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
  title: React.ReactNode;
  description: React.ReactNode;
  data?: CourseProps[];
}

export function Courses({
  title,
  description,
  data = MOCKDATA,
}: CoursesComponentProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const courses = MOCK_COURSES.map((course, index) => (
    <Grid.Col sm={12} md={4} key={index}>
      <Container size={350}>
        <Course {...course} />
      </Container>
    </Grid.Col>
  ));

  return (
    <div className={classes.containerWrapper}>
      <Container className={classes.wrapper}>
        <Title className={classes.title}>{title}</Title>

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
