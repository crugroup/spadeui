import { InfoCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";

export const SystemParamsTooltip = () => (
  <Space>
    <span>System params</span>
    <Tooltip title="JSON dictionary of constant values passed to the executor/processor">
      <InfoCircleOutlined />
    </Tooltip>
  </Space>
);

export const UserParamsTooltip = () => (
  <Space>
    <span>User params</span>
    <Tooltip title="Help text">
      <InfoCircleOutlined />
    </Tooltip>
  </Space>
);
