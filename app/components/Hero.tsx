import {
  Button,
  Container,
  createStyles,
  Group,
  Image,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import lightLogo from "../images/LogoBlack.png";
import darkLogo from "../images/LogoWhite.png";

const BREAKPOINT = "@media (max-width: 755px)";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[2],
  },

  inner: {
    position: "relative",
    paddingTop: 100,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },

  githubControl: {
    borderWidth: 2,
    borderColor:
      theme.colorScheme === "dark" ? "transparent" : theme.colors.dark[9],
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : "transparent",

    "&:hover": {
      backgroundColor: `${
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
      } !important`,
    },
  },
}));

export function Hero() {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <Image
          src={colorScheme === "dark" ? darkLogo : lightLogo}
          alt="Sidequest logo"
          mb={64}
        />

        <h1 className={classes.title}>
          Begin your{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            Game development
          </Text>{" "}
          journey
        </h1>

        <Text className={classes.description} color="dimmed">
          Level up your developer skills while learning all
          about game development
        </Text>

        <Group className={classes.controls}>
          <a href="#courses">
            <Button
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Get started
            </Button>
          </a>
        </Group>
      </Container>
    </div>
  );
}
