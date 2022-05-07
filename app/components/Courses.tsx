import {
  Container,
  createStyles,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import type { Icon as TablerIcon } from "tabler-icons-react";
import { DeviceGamepad } from "tabler-icons-react";

const MOCKDATA = [
  {
    icon: DeviceGamepad,
    title: "Flappy Bird",
    description:
      "We'll recreate the classis Flappy Bird game, with a focus on the physics and gameplay.",
  },
];

interface CourseProps {
  icon: TablerIcon;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Course({ icon: Icon, title, description }: CourseProps) {
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

    [theme.fn.smallerThan("sm")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
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
  const courses = data.map((course, index) => (
    <Course {...course} key={index} />
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

        <SimpleGrid
          mt={60}
          cols={3}
          spacing={theme.spacing.xl * 2}
          breakpoints={[
            { maxWidth: 980, cols: 2, spacing: "xl" },
            { maxWidth: 755, cols: 1, spacing: "xl" },
          ]}
        >
          {courses}
        </SimpleGrid>
      </Container>
    </div>
  );
}
