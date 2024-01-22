import {
  DateField,
  List,
  NumberField,
  Show,
  TextField,
  useTable,
} from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useMany,
  useOne,
  useShow,
} from "@refinedev/core";
import { Table, Typography } from "antd";
import React from "react";
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

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Id</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>Code</Title>
      <TextField value={record?.code} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Executor</Title>
      {record?.executor &&
        (executorIsLoading ? <>Loading...</> : <>{executorData?.data?.name}</>)}
      <Title level={5}>User params</Title>
      <TextField value={record?.user_params ?? ""} />
      <Title level={5}>System params</Title>
      <TextField value={record?.system_params ?? ""} />
      <CanAccess resource="processruns" action="show">
        <List
          title="Process runs"
          breadcrumb={false}
          canCreate={false}
          resource="processruns"
        >
          <Table
            {...processRunsTableProps}
            pagination={{
              ...processRunsTableProps.pagination,
              showSizeChanger: false,
            }}
            rowKey="id"
          >
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
                userIsLoading ? (
                  <>Loading...</>
                ) : (
                  userData?.data?.find((item) => item.id === value)?.email
                )
              }
            />
          </Table>
        </List>
      </CanAccess>
    </Show>
  );
};
