import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip as AntdTooltip, Space } from "antd";
import { FC } from "react";

export type TooltipProps = {
  header: string;
  text: string;
};

export const Tooltip: FC<TooltipProps> = ({ header, text }) => (
  <Space>
    <span>{header}</span>
    <AntdTooltip title={text}>
      <InfoCircleOutlined />
    </AntdTooltip>
  </Space>
);

export const SystemParamsTooltip = () => (
  <Tooltip header="System params" text="JSON dictionary of constant values passed to the executor/processor" />
);

export const UserParamsTooltip = () => (
  <Tooltip
    header="User params"
    text="react-jsonschema-form configuration of a dynamic form displayed on file upload or process execution"
  />
);

export const FormatSchemaParamsTooltip = () => (
  <Tooltip header="Frictionless schema" text="JSON schema of the file format" />
);
