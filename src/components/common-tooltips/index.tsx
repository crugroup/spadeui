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

export const UserParamsTooltip = () => <Tooltip header="User params" text="Help text" />;
