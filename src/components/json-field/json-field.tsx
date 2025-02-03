import ReactJson, { InteractionProps } from "@microlink/react-json-view";
import { FormInstance, Input } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import { darkTheme, lightTheme } from "./themes";

export type JsonFieldProps = {
  value: any;
  form?: FormInstance;
  name?: string;
  collapsed?: boolean;
};

export const JsonField: FC<JsonFieldProps> = ({ value: initialValue, form, name, collapsed }) => {
  const { mode } = useContext(ThemeProviderContext);
  const [value, setValue] = useState(initialValue ?? {});
  const editable = form && name;

  useEffect(() => {
    setValue(initialValue ? initialValue : {});
    form?.setFieldValue(name, initialValue ? initialValue : {});
  }, [initialValue]);

  const onChange = editable
    ? (interaction: InteractionProps) => {
        setValue(interaction.updated_src);
        form.setFieldValue(name, interaction.updated_src);
      }
    : undefined;

  return (
    <>
      {form && <Input.TextArea hidden />}
      <ReactJson
        src={value}
        onEdit={onChange}
        onAdd={onChange}
        onDelete={onChange}
        name={false}
        collapsed={collapsed}
        theme={mode === "light" ? lightTheme : darkTheme}
      ></ReactJson>
    </>
  );
};

export default JsonField;
