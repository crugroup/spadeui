import { Show } from "@refinedev/antd";
import { useShow, useList } from "@refinedev/core";
import { IResourceComponentsProps } from "@refinedev/core";
import { Typography, List as AntList, Divider } from "antd";
import React from "react";

const { Title, Text } = Typography;

export const GroupShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  // Fetch permissions
  const { data: permissionsData } = useList({
    resource: "permissions",
  });

  // Map permission IDs to names
  const permissionNames = record?.permissions?.map((permissionId: string) => {
    const permission = permissionsData?.data.find((p: any) => p.id === permissionId);
    return permission ? permission.name : permissionId;
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>
      <Divider />
      <AntList
        header={<div>Permissions</div>}
        dataSource={permissionNames || []}
        renderItem={(permissionName) => <AntList.Item>{permissionName}</AntList.Item>}
        bordered
      />
    </Show>
  );
};
