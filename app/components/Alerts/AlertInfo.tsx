import { Alert, useMantineTheme } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

type AlertInfoProps = {
  title: string;
};

export const AlertInfo: React.FC<AlertInfoProps> = ({ children, title }) => {
  const theme = useMantineTheme();

  return (
    <Alert
      icon={<AlertCircle size={24} />}
      title={title}
      color="cyan"
      mb={theme.spacing.lg}
    >
      {children}
    </Alert>
  );
};
