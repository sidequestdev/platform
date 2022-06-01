import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Code as InlineCode,
  Container,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Menu,
  Navbar,
  ScrollArea,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { Book, File, Folder, Logout, MoonStars, Sun } from "tabler-icons-react";
import invariant from "tiny-invariant";
import { Logo } from "~/components/Logo";
import { LinksGroup } from "~/components/NavbarLinksGroup/NavbarLinksGroup";
import { UserButton } from "~/components/UserButton/UserButton";
import { UserInfo } from "~/components/UserInfo/UserInfo";
import type { ToCItem } from "~/courses/course.server";
import { getCourseTableOfContents } from "~/courses/course.server";
import { useOptionalUser } from "~/utils";
import { Theme, useTheme } from "~/utils/theme-provider";

type LoaderData = Awaited<ReturnType<typeof getCourseTableOfContents>>;

export const loader: LoaderFunction = async ({ params }) => {
  try {
    invariant(params.courseId, "expected params.courseId");
    invariant(params["*"], "expected params.*");

    const pageData = await getCourseTableOfContents(
      `${params.courseId}/${params["*"]}`
    );

    return pageData;
  } catch (error) {
    console.error(error);

    throw new Response("Not Found", {
      status: 404,
    });
  }
};

const useStyles = createStyles((theme) => ({
  appShell: {
    // Add some offset spacing to account for the navbar
    "h1,h2,h3,h4,h5,h6": {
      "&::before": {
        content: '""',
        display: "block",
        height: "75px",
        marginTop: "-75px",
        visibility: "hidden",
      },
    },
  },

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

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("md")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  mobileUserInfo: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  signUpButton: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  signInButton: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

export default function Courses() {
  const page = useLoaderData<LoaderData>();
  const mantineTheme = useMantineTheme();
  const { classes } = useStyles();
  const { toggleColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = useTheme();
  const [opened, setOpened] = useState(false);
  const [selectedLink, setSelectedLink] = useState(page.slug);
  const user = useOptionalUser();

  const isMobile = useMediaQuery(
    `(max-width: ${mantineTheme.breakpoints.sm}px)`,
    false
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;

      toggleColorScheme(nextTheme);

      return nextTheme;
    });
  };

  invariant(
    "links" in page.tableOfContents,
    "expected links in tableOfContents"
  );

  const links = page.tableOfContents?.links?.map((item) => (
    <LinksGroup
      {...item}
      {...(item.type === "directory"
        ? {
            initiallyOpened:
              item.links
                .filter((link): link is ToCItem => link.type === "file")
                .find((link) => link.link.includes(selectedLink)) != null,
          }
        : {})}
      selected={selectedLink}
      icon={item.type === "directory" ? Folder : File}
      onSelect={(link) => {
        setSelectedLink(link);
        setOpened((o) => !o);
      }}
      key={item.label}
    />
  ));

  return (
    <AppShell
      className={classes.appShell}
      styles={{
        main: {
          background:
            theme === Theme.DARK
              ? mantineTheme.colors.dark[8]
              : mantineTheme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="lg"
      fixed
      navbar={
        <Navbar
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
              <InlineCode sx={{ fontWeight: 700 }}>v1.0.0</InlineCode>
            </Group>
          </Navbar.Section>

          <Navbar.Section className={classes.mobileUserInfo} hidden={!isMobile}>
            {user ? (
              <>
                <UserInfo
                  image="https://github.com/jakeklassen.png"
                  name="Jake Klassen"
                  email="jake@nullpointer.com"
                />

                <Form action="/logout" method="post">
                  <UnstyledButton
                    type="submit"
                    className={classes.link}
                    style={{ width: "100%" }}
                  >
                    Logout
                  </UnstyledButton>
                </Form>
              </>
            ) : (
              <>
                <Link className={classes.link} to="/join">
                  Sign up
                </Link>
                <Link className={classes.link} to="/login">
                  Sign in
                </Link>
              </>
            )}
          </Navbar.Section>

          <Navbar.Section grow className={classes.links} component={ScrollArea}>
            <div className={classes.linksInner}>{links}</div>
          </Navbar.Section>

          {user ? (
            <Navbar.Section className={classes.footer} hidden={isMobile}>
              <Menu
                size="lg"
                position="right"
                placement="start"
                transition="pop-top-right"
                styles={{
                  root: {
                    display: "block",
                  },
                }}
                control={
                  <UserButton name={user.firstName} email={user.email} />
                }
              >
                <Menu.Item
                  icon={<Book size={14} color={mantineTheme.colors.red[6]} />}
                >
                  Your Courses
                </Menu.Item>

                <Menu.Label>Settings</Menu.Label>

                <Form action="/logout" method="post">
                  <Menu.Item<"button">
                    icon={<Logout size={14} />}
                    type="submit"
                  >
                    Logout
                  </Menu.Item>
                </Form>
              </Menu>
            </Navbar.Section>
          ) : null}
        </Navbar>
      }
      header={
        <Header height={56} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={mantineTheme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Logo colorScheme={mantineTheme.colorScheme} />

            <Group>
              {user ? null : (
                <>
                  <Button
                    component={Link}
                    className={classes.signUpButton}
                    color="pink"
                    to="/join"
                  >
                    Sign up
                  </Button>
                  <Button
                    component={Link}
                    className={classes.signInButton}
                    color="blue"
                    to="/login"
                  >
                    Sign in
                  </Button>
                </>
              )}

              <ActionIcon onClick={toggleTheme} size={40}>
                {theme === Theme.DARK ? (
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
        <Outlet />
      </Container>
    </AppShell>
  );
}
