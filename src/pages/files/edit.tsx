import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";

export const FileEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const filesData = queryResult?.data?.data;

  const { selectProps: formatSelectProps } = useSelect({
    resource: "fileformats",
    optionLabel: "format",
  });

  const { selectProps: processorSelectProps } = useSelect({
    resource: "fileprocessors",
    optionLabel: "name",
  });

  const { selectProps: linkedProcessSelectProps } = useSelect({
    resource: "processes",
    optionLabel: "code",
  });

  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name"
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Tags"
          name={["tags"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...tagsSelectProps} mode="tags" style={{ width: "100%" }} placeholder="Tags" />
        </Form.Item>
        <Form.Item
          label="Format"
          name={"format"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...formatSelectProps} />
        </Form.Item>
        <Form.Item
          label="Processor"
          name={"processor"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...processorSelectProps} />
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
          <Input.TextArea />
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
        <Form.Item
          label="Linked process"
          name={"linked_process"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select {...linkedProcessSelectProps} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
