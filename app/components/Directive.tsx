import { Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

/**
 * @see https://gist.github.com/mfal/88fe927f2061d22425cc78fcec8d260f
 */
export interface DirectiveProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

export const Directive = (
  props: React.DetailedHTMLProps<DirectiveProps, HTMLDivElement>
) => {
  if (props.type === "info") {
    console.log(props);
    return (
      <Alert icon={<AlertCircle size={24} />} title={props.title} color="cyan">
        {props.children}
      </Alert>
    );
  }

  return <div {...props} />;
};
