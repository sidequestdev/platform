import { Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

type AlertInfoProps = {
  title: string;
};

export const AlertInfo: React.FC<AlertInfoProps> = ({ children, title }) => {
  return (
    <Alert icon={<AlertCircle size={24} />} title={title} color="cyan">
      {children}
    </Alert>
  );
};
