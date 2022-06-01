import {
  Avatar,
  createStyles,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React, { forwardRef } from "react";
import { ChevronRight } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  image?: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  function UserButton({ image, name, email, icon, ...others }, ref) {
    const { classes } = useStyles();

    return (
      <UnstyledButton ref={ref} className={classes.user} {...others}>
        <Group>
          {image ? (
            <Avatar src={image} radius="xl" />
          ) : (
            <Avatar src={image} radius="xl">
              {name.at(0)}
            </Avatar>
          )}

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>

            <Text color="dimmed" size="xs">
              {email}
            </Text>
          </div>

          {icon || <ChevronRight size={14} />}
        </Group>
      </UnstyledButton>
    );
  }
);
