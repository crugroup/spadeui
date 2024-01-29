import { DateField, List, NumberField, Show, TextField, useTable } from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useGetToPath,
  useMany,
  useOne,
  useResource,
  useShow,
} from "@refinedev/core";
import { Divider, Input, Table, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { ProcessRunButton } from "../../components/process-run-button";
import { DEFAULT_PAGE_SIZE } from "../../rest-data-provider";

const { Title } = Typography;

export const ProcessShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { data: executorData, isLoading: executorIsLoading } = useOne({
    resource: "executors",
    id: record?.executor || "",
    queryOptions: {
      enabled: !!record?.executor,
    },
  });

  const { tableProps: processRunsTableProps } = useTable({
    syncWithLocation: true,
    resource: "processruns",
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
  });

  const { data: userData, isLoading: userIsLoading } = useMany({
    resource: "users",
    ids: processRunsTableProps?.dataSource?.map((item) => item?.user) ?? [],
    queryOptions: {
      enabled: !!processRunsTableProps?.dataSource,
    },
  });

  const getToPath = useGetToPath();
  const executorResource = useResource("executors").resource;

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <ProcessRunButton buttonProps={{ type: "primary" }} />
        </>
      )}>
      <Title level={5}>Id</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>Code</Title>
      <TextField value={record?.code} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Executor</Title>
      <Typography.Paragraph>
        {record?.executor &&
          (executorIsLoading ? (
            <>Loading...</>
          ) : (
            <Link
              to={
                getToPath({
                  resource: executorResource,
                  action: "show",
                  meta: { id: record?.executor },
                }) ?? "#"
              }>
              {executorData?.data?.name}
            </Link>
          ))}
      </Typography.Paragraph>
      <Title level={5}>User params</Title>
      <Typography.Paragraph>
        <Input.TextArea value={record?.user_params ?? ""} readOnly rows={8} style={{ fontFamily: "monospace" }} />
      </Typography.Paragraph>
      <Title level={5}>System params</Title>
      <Typography.Paragraph>
        <Input.TextArea value={record?.system_params ?? ""} readOnly rows={8} style={{ fontFamily: "monospace" }} />
      </Typography.Paragraph>
      <CanAccess resource="processruns" action="show">
        <Divider />
        <List title="Process runs" breadcrumb={false} canCreate={false} resource="processruns">
          <Table
            {...processRunsTableProps}
            pagination={{
              ...processRunsTableProps.pagination,
              showSizeChanger: false,
            }}
            rowKey="id">
            <Table.Column
              dataIndex="created_at"
              title="Started At"
              render={(value) => <DateField value={value} format="LLL" />}
            />
            <Table.Column dataIndex="status" title="Status" />
            <Table.Column dataIndex="result" title="Result" />
            <Table.Column
              dataIndex={["user"]}
              title="User"
              render={(value) =>
                userIsLoading ? <>Loading...</> : userData?.data?.find((item) => item.id === value)?.email
              }
            />
          </Table>
        </List>
      </CanAccess>
    </Show>
  );
};
