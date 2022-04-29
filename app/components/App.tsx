import type { ColorScheme } from "@mantine/core";
import {
  Accordion,
  ActionIcon,
  AppShell,
  Burger,
  Footer,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Outlet } from "@remix-run/react";
import React, { useState } from "react";
import { MoonStars, Sun } from "tabler-icons-react";

function Logo({ colorScheme }: { colorScheme: ColorScheme }) {
  return (
    <Text size="lg" weight={500}>
      Sidequest
    </Text>
  );
}

export default function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
      navbarOffsetBreakpoint="md"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="md"
          hidden={!opened}
          width={{ md: 300, lg: 300 }}
        >
          <Accordion iconPosition="right">
            <Accordion.Item
              label="Flappy Bird"
              style={{ border: "none" }}
              styles={{
                contentInner: { paddingRight: 0 },
                control: { padding: "8px" },
              }}
            >
              <Accordion iconPosition="right">
                <Accordion.Item
                  label="Introduction"
                  style={{ border: "none" }}
                  styles={{
                    control: { padding: "8px" },
                  }}
                >
                  <Accordion.Item
                    label="Welcome"
                    iconSize={0}
                    style={{ border: "none" }}
                    styles={{
                      control: { padding: "8px" },
                      icon: {
                        margin: 0,
                      },
                    }}
                  />
                  <Accordion.Item
                    label="Prerequisites"
                    iconSize={0}
                    style={{ border: "none" }}
                    styles={{
                      control: { padding: "8px" },
                      icon: {
                        margin: 0,
                      },
                    }}
                  />
                </Accordion.Item>
              </Accordion>

              <Accordion iconPosition="right">
                <Accordion.Item
                  label="Project Setup"
                  style={{ border: "none" }}
                  styles={{
                    control: { padding: "8px" },
                  }}
                >
                  <Accordion.Item
                    label="Getting Started"
                    iconSize={0}
                    style={{ border: "none" }}
                    styles={{
                      control: { padding: "8px" },
                      icon: {
                        margin: 0,
                      },
                    }}
                  />
                  <Accordion.Item
                    label="Setting up the Canvas"
                    iconSize={0}
                    style={{ border: "none" }}
                    styles={{
                      control: { padding: "8px" },
                      icon: {
                        margin: 0,
                      },
                    }}
                  />
                </Accordion.Item>
              </Accordion>
            </Accordion.Item>
          </Accordion>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          &copy; 2022 Sidequest
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group position="apart" style={{ width: "100%" }}>
              <Logo colorScheme={colorScheme} />
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
      <Outlet />
    </AppShell>
  );
}
