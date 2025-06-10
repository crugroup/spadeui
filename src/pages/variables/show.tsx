import { DeleteButton, EditButton, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Typography, Space, Tag, Card } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import React from "react";

const { Title, Text } = Typography;

export const VariableShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
      headerButtons={
        <Space>
          <EditButton />
          <DeleteButton />
        </Space>
      }
    >
      <Title level={5}>Name</Title>
      <TextField value={record?.name} />

      <Title level={5}>Description</Title>
      <TextField value={record?.description || "No description provided"} />

      <Title level={5}>Type</Title>
      <Tag
        color={record?.is_secret ? "red" : "blue"}
        icon={record?.is_secret ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      >
        {record?.is_secret ? "Secret" : "Regular"}
      </Tag>

      <Title level={5}>Value</Title>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {record?.is_secret ? (
            <Text type="secondary">••••••••••••••••</Text>
          ) : (
            <Text code style={{ wordBreak: "break-all" }}>
              {record?.value}
            </Text>
          )}
        </Space>
      </Card>
    </Show>
  );
};
