import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useSelect, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Select, Space, Table, Tag } from "antd";
import React from "react";
import { FileUploadButton } from "../../components";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

export const FileList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
  });

  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name",
  });

  return (
    <List canCreate={true}>
      <Table {...tableProps} pagination={{ ...tableProps.pagination, showSizeChanger: false }} rowKey="id">
        <Table.Column
          dataIndex="code"
          title="Code"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by title" />
            </FilterDropdown>
          )}
        />
        <Table.Column dataIndex="description" title="Description" sorter />{" "}
        <Table.Column
          dataIndex="tags"
          title="Tags"
          render={(tags: string[]) => tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select allowClear {...tagsSelectProps} className="filter-dropdown__select" />
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
              <FileUploadButton hideText buttonProps={{ size: "small", type: "primary" }} recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
