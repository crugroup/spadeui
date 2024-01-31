import ReactJson, { InteractionProps } from "@microlink/react-json-view";
import { FormInstance, Input } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import { darkTheme, lightTheme } from "./themes";

export type JsonFieldProps = {
  value: any;
  form?: FormInstance;
  name?: string;
};

export const JsonField: FC<JsonFieldProps> = ({ value: initialValue, form, name }) => {
  const { mode } = useContext(ThemeProviderContext);
  const [value, setValue] = useState(initialValue ?? {});
  const editable = form && name;

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({ [name]: value });
    }
  }, [value]);

  const onChange = editable
    ? (interaction: InteractionProps) => {
        setValue(interaction.updated_src);
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
        theme={mode === "light" ? lightTheme : darkTheme}
      ></ReactJson>
    </>
  );
};

export default JsonField;
