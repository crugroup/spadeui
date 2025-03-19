import { Show } from "@refinedev/antd";
import { useShow, useList } from "@refinedev/core";
import { IResourceComponentsProps } from "@refinedev/core";
import { Typography, List as AntList, Divider } from "antd";
import React from "react";

const { Title, Text } = Typography;

export const UserShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  // Fetch groups
  const { data: groupsData } = useList({
    resource: "groups",
  });

  // Fetch permissions
  const { data: permissionsData } = useList({
    resource: "permissions",
  });

  // Map group IDs to names
  const groupNames = record?.groups?.map((groupId: number) => {
    const group = groupsData?.data.find((g: any) => g.id === groupId);
    return group ? group.name : groupId;
  });

  // Map permission IDs to names
  const permissionNames = record?.user_permissions?.map((permissionId: number) => {
    const permission = permissionsData?.data.find((p: any) => p.id === permissionId);
    return permission ? permission.name : permissionId;
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>First Name</Title>
      <Text>{record?.first_name}</Text>
      <Title level={5}>Last Name</Title>
      <Text>{record?.last_name}</Text>
      <Title level={5}>Email</Title>
      <Text>{record?.email}</Text>
      <Title level={5}>Active</Title>
      <Text>{record?.is_active ? "Yes" : "No"}</Text>

      <Divider />
      <AntList
        header={<div>Groups</div>}
        dataSource={groupNames || []}
        renderItem={(groupName) => <AntList.Item>{groupName}</AntList.Item>}
        bordered
      />

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
