import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Space, Table, Tooltip, Tag } from "antd";
import React from "react";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

export const VariableSetList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    sorters: {
      initial: [
        {
          field: "name",
          order: "asc",
        },
      ],
    },
  });

  return (
    <List canCreate={true}>
      <Table {...tableProps} pagination={{ ...tableProps.pagination, showSizeChanger: false }} rowKey="id">
        <Table.Column
          dataIndex="name"
          title="Name"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by name" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="description"
          title="Description"
          render={(value) => (
            <Tooltip title={value}>
              <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value || "-"}
              </div>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="variables"
          title="Number of Variables"
          render={(variables: number[]) => <Tag color="blue">{variables?.length || 0}</Tag>}
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
