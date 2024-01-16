import { DateField, NumberField, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

export const ProcessShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { data: executorData, isLoading: executorIsLoading } = useOne({
    resource: "executors",
    id: record?.executor || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Id</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>Code</Title>
      <TextField value={record?.code} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Created At</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>Executor</Title>
      {executorIsLoading ? <>Loading...</> : <>{executorData?.data?.name}</>}
      <Title level={5}>User params</Title>
      <TextField value={record?.user_params ?? ""} />
      <Title level={5}>System params</Title>
      <TextField value={record?.system_params ?? ""} />
    </Show>
  );
};
