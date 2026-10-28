import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Form, Input, Transfer } from "antd";
import React, { useState } from "react";

export const GroupCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();

  // State to manage selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);

  // Fetch permissions using useList hook
  const {
    result: permissionsResult,
    query: { isLoading: permissionsLoading },
  } = useList({
    resource: "permissions",
  });
  const permissions = permissionsResult?.data || [];

  return (
    <Create saveButtonProps={saveButtonProps} isLoading={permissionsLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the group name" }]}>
          <Input />
        </Form.Item>

        {/* Transfer component for permissions */}
        <Form.Item label="Permissions" name="permissions">
          <Transfer
            dataSource={permissions}
            titles={["Available", "Selected"]}
            targetKeys={selectedPermissions}
            onChange={setSelectedPermissions}
            render={(item) => item.name}
            rowKey={(item) => item.id as React.Key}
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
