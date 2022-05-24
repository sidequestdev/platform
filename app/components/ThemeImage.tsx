import { ColorScheme, Image } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

type ThemeImageProps = {
  light: {
    src: string;
    width: number;
    height: number;
  };
  dark: {
    src: string;
    width: number;
    height: number;
  };
};

/**
 * Image component that switches between two images based on the current theme.
 */
export const ThemeImage: React.FC<ThemeImageProps> = (
  props: ThemeImageProps
) => {
  // TODO Wrap this into a custom hook?
  // const [colorScheme] = useLocalStorage<ColorScheme>({
  //   key: "color-scheme",
  //   defaultValue: "light",
  // });

  const colorScheme = "dark";

  return colorScheme === "dark" ? (
    <Image src={props.dark.src} />
  ) : (
    <Image src={props.light.src} />
  );
};
