import { DeleteButton, EditButton, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow, useList } from "@refinedev/core";
import { Typography, Space, List, Tag, Card } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import React from "react";

const { Title } = Typography;

export const VariableSetShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  // Fetch variables to get details for the variables in this set
  const { data: variablesData } = useList({
    resource: "variables",
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!record?.variables?.length,
    },
  });

  const allVariables = variablesData?.data || [];
  const setVariables = allVariables.filter((variable) => record?.variables?.includes(variable.id));

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

      <Title level={5}>Variables ({setVariables.length})</Title>
      <Card size="small">
        <List
          dataSource={setVariables}
          renderItem={(variable) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    {variable.name}
                    <Tag
                      color={variable.is_secret ? "red" : "blue"}
                      icon={variable.is_secret ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    >
                      {variable.is_secret ? "Secret" : "Regular"}
                    </Tag>
                  </Space>
                }
                description={variable.description || "No description"}
              />
            </List.Item>
          )}
          locale={{ emptyText: "No variables in this set" }}
        />
      </Card>
    </Show>
  );
};
