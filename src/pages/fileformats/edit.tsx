import { Edit, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input } from "antd";
import React from "react";
import { ErrorNotifications } from "../../components/error-notifications";
import { FormatSchemaParamsTooltip } from "../../components/common-tooltips";

import JsonField from "../../components/json-field/json-field";

export const FileFormatEdit: React.FC<IResourceComponentsProps> = () => {
  const { form, formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ErrorNotifications formProps={formProps} />
        <Form.Item
          label="Format"
          name={["format"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={<FormatSchemaParamsTooltip />}
          name={"frictionless_schema"}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <JsonField form={form} name="frictionless_schema" value={formProps.initialValues?.frictionless_schema} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
