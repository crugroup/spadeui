import { DateField, FilterDropdown, List, Show, TextField, useTable } from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useGetToPath,
  useMany,
  useOne,
  useResource,
  useShow,
} from "@refinedev/core";
import { Select, Table, Tabs, Tag, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import IconStatusMapper from "../../components/icon-status-mapper/icon-status-mapper";
import JsonField from "../../components/json-field/json-field";
import { ProcessRunButton } from "../../components/process-run-button";
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
    syncWithLocation: false,
    resource: "processruns",
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    filters: {
      permanent: [
        {
          field: "process",
          value: record?.id,
          operator: "eq",
        },
      ],
    },
  });

  const { data: userData, isLoading: userIsLoading } = useMany({
    resource: "users",
    ids: processRunsTableProps?.dataSource?.map((item) => item?.user) ?? [],
    queryOptions: {
      enabled: !!processRunsTableProps?.dataSource,
    },
  });

  const getToPath = useGetToPath();
  const executorResource = useResource("executors").resource;

  const definitionsTab = (
    <>
      <Title level={5}>Code</Title>
      <TextField value={record?.code} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Tags</Title>
      <Typography.Paragraph>{record?.tags?.map((tag: string) => <Tag key={tag}>{tag}</Tag>)}</Typography.Paragraph>
      <Title level={5}>Executor</Title>
      <Typography.Paragraph>
        {record?.executor &&
          (executorIsLoading ? (
            <>Loading...</>
          ) : (
            <Link
              to={
                getToPath({
                  resource: executorResource,
                  action: "show",
                  meta: { id: record?.executor },
                }) ?? "#"
              }
            >
              {executorData?.data?.name}
            </Link>
          ))}
      </Typography.Paragraph>
      <Title level={5}>
        <SystemParamsTooltip />
      </Title>
      <Typography.Paragraph>
        {record?.system_params && <JsonField value={record?.system_params} />}
      </Typography.Paragraph>
      <Title level={5}>
        <UserParamsTooltip />
      </Title>
      <Typography.Paragraph>{record?.user_params && <JsonField value={record?.user_params} />}</Typography.Paragraph>
    </>
  );

  const historyTab = (
    <CanAccess resource="processruns" action="show">
      <List title={<></>} breadcrumb={false} canCreate={false} resource="processruns">
        <Table {...processRunsTableProps} pagination={false} rowKey="id">
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value) => <IconStatusMapper status={value} />}
            sorter
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select allowClear className="filter-dropdown__select">
                  <Select.Option value="new">New</Select.Option>
                  <Select.Option value="running">Running</Select.Option>
                  <Select.Option value="finished">Finished</Select.Option>
                  <Select.Option value="error">Error</Select.Option>
                </Select>
              </FilterDropdown>
            )}
          />
          <Table.Column
            dataIndex="result"
            title="Result"
            render={(value) => <IconStatusMapper status={value} />}
            sorter
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select allowClear className="filter-dropdown__select">
                  <Select.Option value="sucess">Success</Select.Option>
                  <Select.Option value="warning">Warning</Select.Option>
                  <Select.Option value="error">Error</Select.Option>
                </Select>
              </FilterDropdown>
            )}
          />
          <Table.Column
            dataIndex="output"
            title="Output"
            render={(value) => value && <JsonField value={value} collapsed={true} />}
            sorter
          />
          <Table.Column dataIndex="error_message" title="Error message" sorter />
          <Table.Column
            dataIndex="created_at"
            title="Created At"
            render={(value) => <DateField value={value} format="LLL" />}
            sorter
          />
          <Table.Column
            dataIndex={["user"]}
            title="User"
            render={(value) =>
              userIsLoading ? <>Loading...</> : userData?.data?.find((item) => item.id === value)?.email
            }
            sorter
          />
        </Table>
      </List>
    </CanAccess>
  );

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <ProcessRunButton buttonProps={{ type: "primary" }} />
        </>
      )}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Definitions",
            children: definitionsTab,
          },
          {
            key: "2",
            label: "History",
            children: historyTab,
          },
        ]}
      />
    </Show>
  );
};
