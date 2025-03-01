import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { IResourceComponentsProps } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;

export const GroupShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>
    </Show>
  );
};
