import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Footer } from "./components/Footer";
import { HeaderResponsive } from "./components/Header";
import { MantineTheme } from "./components/MantineTheme";
import { footerData } from "./mocks/footer";
import { navbarLinks } from "./mocks/navbar";
import type { Theme } from "./utils/theme-provider";
import { ThemeProvider } from "./utils/theme-provider";
import { getThemeSession } from "./utils/theme.server";

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Sidequest",
  viewport: "width=device-width,initial-scale=1",
});

export type LoaderData = {
  theme: Theme | null;
  coursePage: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    coursePage: request.url.includes("courses"),
  };

  return data;
};

export default function Root() {
  const data = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider specifiedTheme={data.theme}>
          <MantineTheme>
            {/* If this is a course page, do NOT load the main app layout */}
            {data.coursePage ? (
              <Outlet />
            ) : (
              <>
                <HeaderResponsive
                  links={navbarLinks.filter((link) => link.hidden !== true)}
                />
                <Outlet />
                <Footer data={footerData} />
              </>
            )}
          </MantineTheme>
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
