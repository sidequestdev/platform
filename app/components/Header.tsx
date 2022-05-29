import {
  ActionIcon,
  Avatar,
  Burger,
  Button,
  createStyles,
  Divider,
  Group,
  Header,
  Menu,
  Paper,
  Text,
  Transition,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { Form, Link } from "@remix-run/react";
import React, { useState } from "react";
import { Book, ChevronDown, Logout, MoonStars, Sun } from "tabler-icons-react";
import { useOptionalUser } from "~/utils";
import { Logo } from "./Logo";

const HEADER_HEIGHT = 56;

const useStyles = ({ fluid }: { fluid?: boolean } = {}) =>
  createStyles((theme) => ({
    header: {
      position: "relative",
      zIndex: 1,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },

    inner: {
      height: HEADER_HEIGHT,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      ...(fluid ? {} : { maxWidth: "1440px" }),
      margin: "auto",
    },

    links: {
      [theme.fn.smallerThan("md")]: {
        display: "none",
      },
    },

    dropdown: {
      position: "absolute",
      top: HEADER_HEIGHT,
      left: 0,
      right: 0,
      zIndex: 0,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      borderTopWidth: 0,
      overflow: "hidden",

      [theme.fn.largerThan("md")]: {
        display: "none",
      },
    },

    burger: {
      [theme.fn.largerThan("md")]: {
        display: "none",
      },
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
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
      },

      [theme.fn.smallerThan("md")]: {
        borderRadius: 0,
        padding: theme.spacing.md,
      },
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 3 : 7
          ],
      },
    },

    userMenu: {
      [theme.fn.smallerThan("md")]: {
        display: "none",
      },
    },

    user: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      transition: "background-color 100ms ease",

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
      },
    },

    userActive: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    signUpButton: {
      [theme.fn.smallerThan("md")]: {
        display: "none",
      },
    },

    signInButton: {
      [theme.fn.smallerThan("md")]: {
        display: "none",
      },
    },
  }));

interface HeaderResponsiveProps {
  fluid?: boolean;
  links: { link: string; label: string }[];
}

export function HeaderResponsive({ fluid, links }: HeaderResponsiveProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const mantineTheme = useMantineTheme();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = useStyles({ fluid })();
  const user = useOptionalUser();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={() => toggleOpened(false)}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
          />

          <Transition
            transition="pop-top-right"
            duration={200}
            mounted={opened}
          >
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {user ? (
                  <Form action="/logout" method="post">
                    <UnstyledButton
                      type="submit"
                      className={classes.link}
                      onClick={() => toggleOpened(false)}
                      style={{ width: "100%" }}
                    >
                      Logout
                    </UnstyledButton>
                  </Form>
                ) : (
                  <>
                    <Link
                      className={classes.link}
                      to="/join"
                      onClick={() => toggleOpened(false)}
                    >
                      Sign up
                    </Link>
                    <Link
                      className={classes.link}
                      to="/login"
                      onClick={() => toggleOpened(false)}
                    >
                      Sign in
                    </Link>
                  </>
                )}

                <Divider />

                {items}
              </Paper>
            )}
          </Transition>
          <Logo colorScheme={colorScheme} />
        </Group>

        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {items}
          </Group>

          {user ? (
            <Menu
              size={260}
              placement="end"
              transition="pop-top-right"
              className={classes.userMenu}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              control={
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      // src={user.image}
                      alt={user.firstName}
                      radius="xl"
                      size={32}
                    >
                      {user.firstName.at(0)}
                    </Avatar>
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.firstName}
                    </Text>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              }
            >
              <Menu.Item
                icon={<Book size={14} color={mantineTheme.colors.red[6]} />}
              >
                Your Courses
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>

              <Form action="/logout" method="post">
                <Menu.Item<"button"> icon={<Logout size={14} />} type="submit">
                  Logout
                </Menu.Item>
              </Form>
            </Menu>
          ) : (
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
  );
}
