import type { ColorScheme } from "@mantine/core";
import {
  ActionIcon,
  AppShell,
  Aside,
  Burger,
  Code as InlineCode,
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
import type { PrismProps } from "@mantine/prism";
import { Prism } from "@mantine/prism";
import type { PrismSharedProps } from "@mantine/prism/lib/types";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ComponentMap } from "mdx-bundler/client";
import { getMDXComponent } from "mdx-bundler/client";
import React, { useState } from "react";
import { File, Folder, MoonStars, Sun } from "tabler-icons-react";
import invariant from "tiny-invariant";
import { Logo } from "~/components/Logo";
import { LinksGroup } from "~/components/NavbarLinksGroup/NavbarLinksGroup";
import { TableOfContents } from "~/components/TableOfContents";
import { UserButton } from "~/components/UserButton/UserButton";
import { getMdxPage } from "~/courses/course.server";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    console.log(params);

    invariant(params.courseId, "expected params.courseId");
    invariant(params["*"], "expected params.*");

    const courseId = params.courseId;
    const slug = `${courseId}/${params["*"]}`;

    const page = await getMdxPage(slug);

    return page;
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

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

// TODO: Move to a separate file.
const Code = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  const { className, children } = props;

  // If there is no className, this in an inline code block.
  // e.g. `const foo = "bar";`
  if (className == null) {
    return <InlineCode>{children}</InlineCode>;
  }

  invariant(className, "expected className");
  invariant(typeof children === "string", "expected children");

  const language: PrismSharedProps["language"] | undefined = className
    ?.split(":")[0]
    ?.split("-")
    .pop() as PrismSharedProps["language"];

  invariant(language, "expected language");

  const title = className?.split(":")[1];

  const options: PrismProps = {
    children,
    language,
    withLineNumbers: true,
  };

  return (
    <Prism
      {...options}
      styles={{
        code: {
          border: "1px solid #aaa",
          fontSize: "14px",
        },
      }}
    />
  );
};

const MDXComponents: ComponentMap = {
  code: Code,
};

interface CourseShellProps {
  page: Awaited<ReturnType<typeof getMdxPage>>;
}

export function CourseShell({ page }: CourseShellProps) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  const Component = React.useMemo(
    () => getMDXComponent(page.code),
    [page.code]
  );

  const links = page.tableOfContents.links.map((item) => (
    <LinksGroup
      {...item}
      icon={Array.isArray(item.links) ? Folder : File}
      key={item.label}
    />
  ));

  return (
    <AppShell
      className={classes.appShell}
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
            <TableOfContents
              links={page.pageTableOfContents.map((item) => ({
                label: item.value,
                link: item.url,
                order: item.depth,
              }))}
            />
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
        <Component components={MDXComponents} />
      </Container>
    </AppShell>
  );
}

export default function Course() {
  const page = useLoaderData<Awaited<ReturnType<typeof getMdxPage>>>();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  console.log(JSON.stringify(page, null, 2));

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
        <CourseShell page={page} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
