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

  const shared = {
    alt: props.alt,
    width:
      typeof props.width === "string" ? parseInt(props.width) : props.width,
    height:
      typeof props.height === "string" ? parseInt(props.height) : props.height,
  };

  return colorScheme === "dark" ? (
    <Image src={props.dark.src} fit="contain" {...shared} />
  ) : (
    <Image src={props.light.src} fit="contain" {...shared} />
  );
};
