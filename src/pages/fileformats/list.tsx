import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Space, Table } from "antd";
import React from "react";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

export const FileFormatList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
  });

  return (
    <List canCreate={true}>
      <Table {...tableProps} pagination={{ ...tableProps.pagination, showSizeChanger: false }} rowKey="id">
        <Table.Column
          dataIndex="format"
          title="Format"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by format" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          title="Has Schema"
          dataIndex="frictionless_schema"
          align="center"
          render={(value: any) => <input type="checkbox" checked={!!value} readOnly />}
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
