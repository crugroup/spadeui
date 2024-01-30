import Form from "@rjsf/antd";
import { useContext } from "react";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import { FormProps } from "@rjsf/core";

export const RjsfForm = ({ children, ...rest }: FormProps) => {
  const { mode } = useContext(ThemeProviderContext);

  return (
    <Form {...rest} className={`rjsf-form rjsf-form-${mode}`}>
      {children}
    </Form>
  );
};
