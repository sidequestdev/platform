import { Container, createStyles, Text, Title } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
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
    },
  },

  description: {
    textAlign: "center",
  },
}));

export default function CatchAll() {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>Page Not Found</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          This page does not exist
        </Text>
      </Container>
    </Container>
  );
}
