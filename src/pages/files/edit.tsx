import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import { ErrorNotifications } from "../../components/error-notifications";
import { JsonField } from "../../components/json-field/json-field";

export const FileEdit: React.FC<IResourceComponentsProps> = () => {
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

  const { selectProps: variableSetSelectProps } = useSelect({
    resource: "variable-sets",
    optionLabel: "name",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
        <Form.Item label="Tags" name={["tags"]}>
          <Select {...tagsSelectProps} mode="tags" placeholder="Tags" />
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
          label="Variable Sets"
          name={"variable_sets"}
          rules={[
            {
              required: false,
            },
          ]}
          tooltip="Select variable sets to make variables available during file processing"
        >
          <Select
            {...variableSetSelectProps}
            mode="multiple"
            placeholder="Select variable sets (optional)"
            allowClear
          />
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
