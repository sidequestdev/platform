import {
  ActionIcon,
  Burger,
  createStyles,
  Group,
  Header,
  Paper,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import React, { useState } from "react";
import { MoonStars, Sun } from "tabler-icons-react";
import { Theme, useTheme } from "~/utils/theme-provider";
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

    search: {
      [theme.fn.smallerThan("xs")]: {
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
  }));

interface HeaderResponsiveProps {
  fluid?: boolean;
  links: { link: string; label: string }[];
}

export function HeaderResponsive({ fluid, links }: HeaderResponsiveProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = useTheme();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState("");
  const { classes } = useStyles({ fluid })();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => {
        setActive(link.link);
        toggleOpened(false);
      }}
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
          <ActionIcon
            onClick={() => {
              setTheme((current) =>
                current === Theme.DARK ? Theme.LIGHT : Theme.DARK
              );

              toggleColorScheme();
            }}
            size={40}
          >
            {theme === "dark" ? <Sun size={24} /> : <MoonStars size={24} />}
          </ActionIcon>
        </Group>
      </div>
    </Header>
  );
}
