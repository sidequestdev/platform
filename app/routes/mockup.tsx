import type { ColorScheme } from "@mantine/core";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Aside,
  Burger,
  Code,
  ColorSchemeProvider,
  Container,
  createStyles,
  Group,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  ScrollArea,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { MoonStars, Sun } from "tabler-icons-react";
import { Logo } from "~/components/Logo";
import { LinksGroup } from "~/components/NavbarLinksGroup/NavbarLinksGroup";
import { TableOfContents, TOC_MOCK_DATA } from "~/components/TableOfContents";
import { UserButton } from "~/components/UserButton/UserButton";
import { mockFlappyBird } from "~/mocks/courses";

const items = [
  { title: "🏠", href: "/" },
  { title: "Introduction", href: "#" },
  { title: "Welcome", href: "#" },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

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

export function AppShellDemo() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  const links = mockFlappyBird.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="lg"
      fixed
      navbar={
        <Navbar
          height={800}
          width={{ sm: 250, lg: 300 }}
          p="md"
          className={classes.navbar}
          hiddenBreakpoint="sm"
          hidden={!opened}
        >
          <Navbar.Section className={classes.header}>
            <Group position="apart">
              <Text size="lg" weight={500}>
                Flappy Bird
              </Text>
              <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
            </Group>
          </Navbar.Section>

          <Navbar.Section grow className={classes.links} component={ScrollArea}>
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
      }
      aside={
        <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
          <Aside
            p="md"
            hiddenBreakpoint="md"
            width={{ md: 300 }}
            styles={{
              root: {
                background: "transparent",
                borderLeft: "none",
              },
            }}
          >
            <TableOfContents links={TOC_MOCK_DATA} />
          </Aside>
        </MediaQuery>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Logo colorScheme={theme.colorScheme} />

            <Group>
              <ActionIcon onClick={() => toggleColorScheme()} size={40}>
                {colorScheme === "dark" ? (
                  <Sun size={24} />
                ) : (
                  <MoonStars size={24} />
                )}
              </ActionIcon>
            </Group>
          </div>
        </Header>
      }
    >
      <Container>
        {/* <Breadcrumbs separator="→">{items}</Breadcrumbs>
        <Space h={20} />
        <Text>Resize app to see responsive navbar in action</Text> */}
        <Outlet />
      </Container>
    </AppShell>
  );
}

export default function Index() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShellDemo />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
