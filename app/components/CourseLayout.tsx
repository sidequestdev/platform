import {
  Code,
  Container,
  createStyles,
  Grid,
  Group,
  Navbar,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { File, Folder } from "tabler-icons-react";
import { HeaderResponsive } from "./Header";
import { LinksGroup } from "./NavbarLinksGroup/NavbarLinksGroup";
import { UserButton } from "./UserButton/UserButton";

const mockdata = [
  { label: "Welcome", icon: File },
  {
    label: "Introduction",
    icon: Folder,
    initiallyOpened: true,
    links: [
      { label: "Welcome", link: "/" },
      { label: "Prerequisites", link: "/" },
    ],
  },
  {
    label: "Project Setup",
    icon: Folder,
    links: [
      { label: "Getting Started", link: "/" },
      { label: "Setting up the Canvas", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  {
    label: "Scrolling Scene",
    icon: Folder,
    links: [
      { label: "Preface", link: "/" },
      { label: "Loading the Sprite Sheet", link: "/" },
      { label: "Drawing the Background", link: "/" },
      { label: "Drawing the Ground", link: "/" },
      { label: "Scrolling the Ground", link: "/" },
      { label: "Delta Time", link: "/" },
    ],
  },
  {
    label: "Adding the Bird",
    icon: Folder,
    links: [
      { label: "Preface", link: "/" },
      { label: "Drawing the Bird", link: "/" },
      { label: "Add Flap Animation", link: "/" },
      { label: "Flap On Click", link: "/" },
      { label: "Bird State", link: "/" },
      { label: "Rotating the Bird", link: "/" },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    height: "calc(100vh - 56px)",
    maxHeight: "calc(100vh - 56px)",
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

const navbarLinks = [
  {
    link: "/courses",
    label: "Courses",
  },
  {
    link: "/blog",
    label: "Blog",
  },
];

export function CoursesLayout() {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Container fluid pl={0} pr={0}>
      <HeaderResponsive links={navbarLinks} />

      <Grid m={0} p={0}>
        <Grid.Col md={3} m={0} p={0}>
          <Navbar
            height={800}
            width={{ sm: 300 }}
            p="md"
            className={classes.navbar}
            hiddenBreakpoint="sm"
          >
            <Navbar.Section className={classes.header}>
              <Group position="apart">
                <Text size="lg" weight={500}>
                  Flappy Bird
                </Text>
                <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
              </Group>
            </Navbar.Section>

            <Navbar.Section
              grow
              className={classes.links}
              component={ScrollArea}
            >
              <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
              <UserButton
                image="https://github.com/jakeklassen.png"
                name="Jake Klassen"
                email="jake@nullpointer.com"
              />
            </Navbar.Section>
          </Navbar>
        </Grid.Col>

        <Grid.Col md={9} m={0} p={0}>
          <p>sup</p>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
