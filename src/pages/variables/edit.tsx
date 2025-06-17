import { Edit, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Switch } from "antd";
import React from "react";

export const VariableEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const variableData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the variable name" },
            { max: 100, message: "Name cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter variable name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter variable description (optional)" rows={3} />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "Please enter the variable value" }]}
          tooltip={variableData?.is_secret ? "This is a secret variable. The current value is encrypted." : undefined}
        >
          <Input.TextArea
            placeholder={
              variableData?.is_secret ? "Enter new value (leave empty to keep current)" : "Enter variable value"
            }
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Secret Variable"
          name="is_secret"
          valuePropName="checked"
          tooltip="Secret variables will be encrypted and hidden in the interface"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
