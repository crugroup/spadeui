import {
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Space, Table, Tag } from "antd";
import React from "react";
import { FileUploadButton } from "../../components";
import { DEFAULT_PAGE_SIZE } from "../../rest-data-provider";

export const FileList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE
    }
  });

  return (
    <List canCreate={true}>
      <Table {...tableProps} rowKey="id">
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
          render={(tags: string[]) => tags.map((tag) => <Tag>{tag}</Tag>)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search by tag" />
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
              <FileUploadButton
                hideText
                buttonProps={{ size: "small", type: "primary" }}
                recordItemId={record.id}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
