import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, DateField } from "@refinedev/antd";
import { Table, Space } from "antd";

const FileList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List canCreate={false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="Id" />
        <Table.Column dataIndex="code" title="Code" />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex={["created_at"]}
          title="Created At"
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column dataIndex="format" title="Format" />
        <Table.Column dataIndex="processor" title="Processor" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              {/* <EditButton hideText size="small" recordItemId={record.id} /> */}
              <ShowButton hideText size="small" recordItemId={record.id} />
              {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export const CategoryList: React.FC<IResourceComponentsProps> = () => {
  return <FileList />;
};
