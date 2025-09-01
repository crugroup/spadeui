import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Input, Space, Table, Tag, Tooltip } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import React from "react";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

export const VariableList: React.FC<IResourceComponentsProps> = () => {
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
          dataIndex="is_secret"
          title="Type"
          render={(isSecret: boolean) => (
            <Tag color={isSecret ? "red" : "blue"} icon={isSecret ? <EyeInvisibleOutlined /> : <EyeOutlined />}>
              {isSecret ? "Secret" : "Regular"}
            </Tag>
          )}
          filters={[
            { text: "Regular", value: false },
            { text: "Secret", value: true },
          ]}
        />
        <Table.Column
          dataIndex="value"
          title="Value"
          render={(value: string, record: BaseRecord) => {
            if (record.is_secret) {
              return <Tag color="red">••••••••</Tag>;
            }
            return (
              <Tooltip title={value}>
                <div style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {value || "-"}
                </div>
              </Tooltip>
            );
          }}
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
