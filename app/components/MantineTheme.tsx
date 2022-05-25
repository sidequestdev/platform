import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";
import { Theme, useTheme } from "~/utils/theme-provider";

export function MantineTheme({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(theme || "dark");

  const toggleColorScheme = (value?: ColorScheme) => {
    setTheme(value || (theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
    setColorScheme(value || (theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme: theme ?? "dark" }}
        withNormalizeCSS
        withGlobalStyles
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
