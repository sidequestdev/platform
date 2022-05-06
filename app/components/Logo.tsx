import type { ColorScheme } from "@mantine/core";
import { Text } from "@mantine/core";

export function Logo({ colorScheme }: { colorScheme: ColorScheme }) {
  return (
    <Text size="lg" weight={500}>
      Sidequest
    </Text>
  );
}
