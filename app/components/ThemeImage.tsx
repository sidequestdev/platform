import type { ImageProps } from "@mantine/core";
import { Image, useMantineColorScheme } from "@mantine/core";

type ThemeImageProps = {
  alt: string;
  width: number | string;
  height: number | string;
  light: {
    src: string;
  };
  dark: {
    src: string;
  };
};

/**
 * Image component that switches between two images based on the current theme.
 */
export const ThemeImage: React.FC<ThemeImageProps> = (
  props: ThemeImageProps
) => {
  const { colorScheme } = useMantineColorScheme();

  const shared: ImageProps = {
    alt: props.alt,
    height:
      typeof props.height === "string" ? parseInt(props.height) : props.height,
    fit: "contain",
    mb: 24,
  };

  return colorScheme === "dark" ? (
    <Image src={props.dark.src} {...shared} />
  ) : (
    <Image src={props.light.src} {...shared} />
  );
};
