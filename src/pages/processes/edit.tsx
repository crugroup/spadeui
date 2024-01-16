import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";

export const ProcessEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const processesData = queryResult?.data?.data;

  const { selectProps: executorSelectProps } = useSelect({
    resource: "executors",
    defaultValue: processesData?.executor,
    optionLabel: "name",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Id"
          name={["id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          label="Code"
          name={["code"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name={["description"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Executor"
          name={"executor"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...executorSelectProps} />
        </Form.Item>
        <Form.Item
          label="System params"
          name={"system_params"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item
          label="User params"
          name={"user_params"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Edit>
  );
};
