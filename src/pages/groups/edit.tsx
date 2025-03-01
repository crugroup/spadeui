import { Edit, useForm } from "@refinedev/antd";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Form, Input, Transfer } from "antd";
import React, { useState } from "react";

export const GroupEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, query } = useForm();
  const { data, isLoading } = query;
  const record = data?.data;

  // State to manage selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Fetch permissions using useList hook
  const { data: permissionsData, isLoading: permissionsLoading } = useList({
    resource: "permissions",
  });

  const permissions = permissionsData?.data || [];

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading || permissionsLoading}>
      <Form {...formProps} layout="vertical" initialValues={record}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the group name" }]}>
          <Input />
        </Form.Item>

        {/* Transfer component for permissions */}
        <Form.Item label="Permissions">
          <Transfer
            dataSource={permissions}
            titles={["Available", "Selected"]}
            targetKeys={selectedPermissions}
            onChange={setSelectedPermissions}
            render={(item) => item.name}
            rowKey={(item) => item.codename}
            style={{ width: "100%" }}
            listStyle={{
              width: "100%",
              height: "500px",
            }}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
