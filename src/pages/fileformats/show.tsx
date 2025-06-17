import { Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";
import { FormatSchemaParamsTooltip } from "../../components/common-tooltips";

import JsonField from "../../components/json-field/json-field";

const { Title } = Typography;

export const FileFormatShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Format</Title>
      <TextField value={record?.format ?? ""} />
      <Title level={5}>
        <FormatSchemaParamsTooltip />
      </Title>
      <Typography.Paragraph>
        {record?.frictionless_schema && <JsonField value={record?.frictionless_schema} />}
      </Typography.Paragraph>
    </Show>
  );
};
