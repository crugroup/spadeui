import { DeleteButton, EditButton, FilterDropdown, List, ShowButton, useSelect, useTable } from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps, useMany } from "@refinedev/core";
import { Input, Select, Space, Table, Tag } from "antd";
import React from "react";
import { ProcessRunButton } from "../../components/process-run-button";
import { DEFAULT_PAGE_SIZE } from "../../rest-data-provider";

export const ProcessList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
  });

  const { data: executorData, isLoading: executorIsLoading } = useMany({
    resource: "executors",
    ids: tableProps?.dataSource?.map((item) => item?.executor) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { selectProps: executorSelectProps } = useSelect({
    resource: "executors",
    optionLabel: "name",
  });

  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name",
  });

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
              <Select allowClear style={{ minWidth: 200 }} {...tagsSelectProps} />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex={["executor"]}
          title="Executor"
          render={(value) =>
            executorIsLoading ? <>Loading...</> : executorData?.data?.find((item) => item.id === value)?.name
          }
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select style={{ minWidth: 200 }} {...executorSelectProps} />
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
