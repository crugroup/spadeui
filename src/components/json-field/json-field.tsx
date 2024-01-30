import ReactJson from "@microlink/react-json-view";
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
    if (form && name) {
      form.setFieldsValue({ [name]: value });
    }
  }, [value]);

  return (
    <>
      {form && <Input.TextArea hidden />}
      <ReactJson
        src={value}
        onEdit={
          editable
            ? (edit) => {
                setValue(edit.updated_src);
              }
            : undefined
        }
        onAdd={
          editable
            ? (add) => {
                setValue(add.updated_src);
              }
            : undefined
        }
        onDelete={
          editable
            ? (del) => {
                setValue(del.updated_src);
              }
            : undefined
        }
        theme={mode === "light" ? lightTheme : darkTheme}
      ></ReactJson>
    </>
  );
};

export default JsonField;
