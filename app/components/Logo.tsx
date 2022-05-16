import type { ColorScheme } from "@mantine/core";
import { createStyles, Text } from "@mantine/core";

const useStyles = createStyles((theme) => {
  return {
    link: {
      fontWeight: 500,
      display: "block",
      textDecoration: "none",
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      paddingLeft: 31,
      marginLeft: 30,
      fontSize: theme.fontSizes.lg,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  };
});

export function Logo({ colorScheme }: { colorScheme: ColorScheme }) {
  const { classes } = useStyles();

  return (
    <Text<"a">
      size="lg"
      weight={500}
      href="/"
      component="a"
      className={classes.link}
    >
      Sidequest
    </Text>
  );
}
