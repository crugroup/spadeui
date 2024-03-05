import { Create, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import { ErrorNotifications } from "../../components/error-notifications";
import JsonField from "../../components/json-field/json-field";

export const ProcessCreate: React.FC<IResourceComponentsProps> = () => {
  const { form, formProps, saveButtonProps, queryResult } = useForm();

  const { selectProps: executorSelectProps } = useSelect({
    resource: "executors",
    optionLabel: "name",
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
              required: false,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Tags" name={["tags"]}>
          <Select {...tagsSelectProps} mode="tags" placeholder="Tags" />
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
      </Form>
    </Create>
  );
};
