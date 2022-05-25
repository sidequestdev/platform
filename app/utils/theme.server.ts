import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { Theme } from "./theme-provider";
import { isTheme } from "./theme-provider";

process.env.SESSION_SECRET = "ae5f73de4cb82b384e818d15e93cb95d";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const THEME_KEY = "theme";

export const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "__sidequest",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getThemeSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await themeStorage.getSession(cookie);

  return {
    getTheme() {
      const themeValue = session.get(THEME_KEY);

      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set(THEME_KEY, theme),
    commit: () => themeStorage.commitSession(session),
  };
}
