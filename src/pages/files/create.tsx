import { Create, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import { ErrorNotifications } from "../../components/error-notifications";
import JsonField from "../../components/json-field/json-field";

export const FileCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, form, saveButtonProps } = useForm();

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
    optionValue: "name",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ErrorNotifications formProps={formProps} />
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
          label={<UserParamsTooltip />}
          name={"user_params"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <JsonField form={form} name="user_params" value={formProps.initialValues?.user_params} />
        </Form.Item>
        <Form.Item
          label={<SystemParamsTooltip />}
          name={"system_params"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <JsonField form={form} name="system_params" value={formProps.initialValues?.system_params} />
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
    </Create>
  );
};
