import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, NumberField, TextField } from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const FileFormatShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
    >
      <Title level={5}>Id</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>Format</Title>
      <TextField value={record?.format ?? ""} />
    </Show>
  );
};