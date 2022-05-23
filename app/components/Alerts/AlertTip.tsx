import { Alert } from "@mantine/core";
import { Bulb } from "tabler-icons-react";

type AlertTipProps = {
  title: string;
};

export const AlertTip: React.FC<AlertTipProps> = ({ children, title }) => {
  return (
    <Alert icon={<Bulb size={24} />} title={title} color="green">
      {children}
    </Alert>
  );
};
