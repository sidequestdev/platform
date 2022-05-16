import {
  Box,
  Collapse,
  createStyles,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import React, { useState } from "react";
import type { Icon as TablerIcon } from "tabler-icons-react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import type { ToCDirectory, ToCItem } from "~/courses/course.server";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");

  return {
    control: {
      fontWeight: 500,
      display: "block",
      width: "100%",
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      fontSize: theme.fontSizes.sm,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },

    link: {
      fontWeight: 500,
      display: "block",
      textDecoration: "none",
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      paddingLeft: 31,
      marginLeft: 30,
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      borderLeft: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },

    linkActive: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
      [`& .${icon}`]: {
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 7
          ],
      },
    },

    chevron: {
      transition: "transform 200ms ease",
    },
  };
});

type LinksGroupProps =
  | {
      icon: TablerIcon;
      label: string;
      selected: string;
      onSelect: (link: string) => void;
    } & (
      | {
          type: ToCItem["type"];
          link: string;
        }
      | {
          type: "directory";
          initiallyOpened?: boolean;
          links: Array<ToCItem | ToCDirectory>;
        }
    );

export function LinksGroup(options: LinksGroupProps) {
  const { onSelect, icon: Icon } = options;
  const { classes, theme, cx } = useStyles();
  const [opened, setOpened] = useState(
    (options.type === "directory" && options.initiallyOpened) ?? false
  );
  const ChevronIcon = theme.dir === "ltr" ? ChevronRight : ChevronLeft;

  const items = (options.type === "directory" ? options.links : [])
    .filter((link): link is ToCItem => link.type === "file")
    .map((link) => (
      <Text<"a">
        onClick={(event) => {
          event.preventDefault();
          onSelect(link.link);
        }}
        component="a"
        className={cx(classes.link, {
          [classes.linkActive]: link.link.includes(options.selected),
        })}
        href={link.link}
        key={link.label}
      >
        {link.label}
      </Text>
    ));

  return (
    <>
      <UnstyledButton
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          event.preventDefault();

          if (options.type === "directory") {
            setOpened((o) => !o);
          }

          if (options.type === "file") {
            onSelect(options.link);
          }
        }}
        className={cx(classes.control, {
          [classes.linkActive]:
            options.type === "directory"
              ? false
              : options.link === options.selected,
        })}
        component="a"
        href={options.type === "file" ? options.link : undefined}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{options.label}</Box>
          </Box>
          {options.type === "directory" && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                  : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {options.type === "directory" ? (
        <Collapse in={opened}>{items}</Collapse>
      ) : null}
    </>
  );
}
