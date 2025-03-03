import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Form, Input, Switch, Transfer } from "antd";
import React, { useState } from "react";

export const UserCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();

  // State to manage selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // State to manage selected groups
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  // Fetch permissions using useList hook
  const { data: permissionsData, isLoading: permissionsLoading } = useList({
    resource: "permissions",
  });

  // Fetch groups using useList hook
  const { data: groupsData, isLoading: groupsLoading } = useList({
    resource: "groups",
  });

  const permissions = permissionsData?.data || [];
  const groups = groupsData?.data || [];

  return (
    <Create saveButtonProps={saveButtonProps} isLoading={permissionsLoading || groupsLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please enter the first name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please enter the last name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Active" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* Transfer component for groups */}
        <Form.Item label="Groups" name="groups">
          <Transfer
            dataSource={groups}
            titles={["Available", "Selected"]}
            targetKeys={selectedGroups}
            onChange={setSelectedGroups}
            render={(item) => item.name}
            rowKey={(item) => item.id}
            style={{ width: "100%" }}
            listStyle={{
              width: "100%",
            }}
          />
        </Form.Item>

        {/* Transfer component for permissions */}
        <Form.Item label="Permissions" name="permissions">
          <Transfer
            dataSource={permissions}
            titles={["Available", "Selected"]}
            targetKeys={selectedPermissions}
            onChange={setSelectedPermissions}
            render={(item) => item.name}
            rowKey={(item) => item.id}
            style={{ width: "100%" }}
            listStyle={{
              width: "100%",
              height: "500px",
            }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
