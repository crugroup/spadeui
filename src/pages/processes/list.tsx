import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import React from "react";

export const ProcessList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { data: executorData, isLoading: executorIsLoading } = useMany({
    resource: "executors",
    ids: tableProps?.dataSource?.map((item) => item?.executor) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="Id" />
        <Table.Column dataIndex="code" title="Code" />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex={["created_at"]}
          title="Created At"
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["executor"]}
          title="Executor"
          render={(value) =>
            executorIsLoading ? (
              <>Loading...</>
            ) : (
              executorData?.data?.find((item) => item.id === value)?.name
            )
          }
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
