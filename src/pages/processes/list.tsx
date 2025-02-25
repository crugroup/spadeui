import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useSelect, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps, useMany } from "@refinedev/core";
import { Input, Select, Space, Table, Tag } from "antd";
import React from "react";
import { ProcessRunButton } from "../../components/process-run-button";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

export const ProcessList: React.FC<IResourceComponentsProps> = () => {
  const { tableQuery, tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    sorters: {
      initial: [
        {
          field: "code",
          order: "asc",
        },
      ]
    },
  });

  const processes = tableQuery.data;
  const tags: string[] | undefined = processes?.data?.map((f: any) => f.tags).flat();
  const tagSet = [...new Set(tags)].sort();

  return (
    <List>
      <Table {...tableProps} pagination={{ ...tableProps.pagination, showSizeChanger: false }} rowKey="id">
        <Table.Column
          dataIndex="code"
          title="Code"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by code" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="description"
          title="Description"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by description" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="tags"
          title="Tags"
          render={(tags: string[]) => tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                allowClear
                options={tagSet.map((name) => ({label: name, value: name}))}
                className="filter-dropdown__select"
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
              <ProcessRunButton hideText buttonProps={{ size: "small", type: "primary" }} recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
