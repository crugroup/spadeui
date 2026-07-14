import { DateField, FilterDropdown, Show, TextField, useTable } from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useGetToPath,
  useMany,
  useOne,
  useShow,
} from "@refinedev/core";
import { Select, Space, Table, Tabs, Tag, Typography } from "antd";
import React from "react";
import { Link } from "react-router";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import JsonField from "../../components/json-field/json-field";
import { ProcessRunButton } from "../../components/process-run-button";
import { HISTORY_QUERY_OPTIONS, STATIC_QUERY_OPTIONS } from "../../config/query-cache";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";

const { Title } = Typography;

export const ProcessShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow({
    queryOptions: STATIC_QUERY_OPTIONS,
  });
  const { data, isLoading } = query ?? {};
  const [activeTabKey, setActiveTabKey] = React.useState("1");

  const record = data?.data;

  const { result: executorData, isLoading: executorIsLoading } = useOne({
    resource: "executors",
    id: record?.executor || "",
    queryOptions: {
      ...STATIC_QUERY_OPTIONS,
      enabled: !!record?.executor,
    },
  });

  const { result: variableSetsResult, isLoading: variableSetsIsLoading } = useMany({
    resource: "variable-sets",
    ids: record?.variable_sets || [],
    queryOptions: {
      ...STATIC_QUERY_OPTIONS,
      enabled: !!record?.variable_sets?.length,
    },
  });
  const variableSetsData = variableSetsResult?.data;

  const { tableProps: processRunsTableProps } = useTable({
    syncWithLocation: false,
    resource: "processruns",
    queryOptions: {
      ...HISTORY_QUERY_OPTIONS,
      enabled: activeTabKey === "2" && !!record?.id,
    },
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

  const { result: userResult, isLoading: userIsLoading } = useMany({
    resource: "users",
    ids: processRunsTableProps?.dataSource?.map((item) => item?.user) ?? [],
    queryOptions: {
      ...HISTORY_QUERY_OPTIONS,
      enabled: activeTabKey === "2" && !!processRunsTableProps?.dataSource?.length,
    },
  });
  const userData = userResult?.data;

  const getToPath = useGetToPath();

  const getRunState = (status?: string, result?: string) => {
    const normalizedStatus = status?.toLowerCase();
    const normalizedResult = result?.toLowerCase();

    if (normalizedStatus === "running" || normalizedStatus === "new") return "running";
    if (
      normalizedStatus === "failed" ||
      normalizedStatus === "error" ||
      normalizedResult === "failed" ||
      normalizedResult === "error" ||
      normalizedResult === "warning"
    )
      return "failed";
    if (normalizedResult === "success" || normalizedStatus === "finished") return "success";
    return "idle";
  };

  const definitionsTab = (
    <div className="entity-show-shell">
      <Title level={5}>Name</Title>
      <TextField value={record?.code} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Tags</Title>
      <Typography.Paragraph>
        {record?.tags?.map((tag: string) => (
          <Tag className="entity-tag" key={tag}>
            {tag}
          </Tag>
        ))}
      </Typography.Paragraph>
      <Title level={5}>Executor</Title>
      <Typography.Paragraph>
        {record?.executor &&
          (executorIsLoading ? (
            <>Loading...</>
          ) : (
            <Link
              to={
                getToPath({
                  resource: "executors",
                  action: "show",
                  meta: { id: record?.executor },
                }) ?? "#"
              }
            >
              {executorData?.data?.name}
            </Link>
          ))}
      </Typography.Paragraph>
      <Title level={5}>Variable Sets</Title>
      <Typography.Paragraph>
        {record?.variable_sets?.length ? (
          variableSetsIsLoading || variableSetsData?.data == null ? (
            <>Loading...</>
          ) : (
            <div>
              {record?.variable_sets?.map((variableSetId: number, index: number) => {
                const variableSet = variableSetsData.data.find((item) => item.id === variableSetId);
                if (!variableSet) return <>undefined</>;
                return (
                  <span key={variableSet.id}>
                    <Link
                      to={
                        getToPath({
                          resource: "variable-sets",
                          action: "show",
                          meta: { id: variableSet.id },
                        }) ?? "#"
                      }
                    >
                      {variableSet.name}
                    </Link>
                    {index < record.variable_sets.length - 1 && ", "}
                  </span>
                );
              })}
            </div>
          )
        ) : (
          "No variable sets assigned"
        )}
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
    </div>
  );

  const historyTab = (
    <CanAccess resource="processruns" action="show">
      <div className="entity-table-shell entity-table-shell--flat">
        <Table
          {...processRunsTableProps}
          pagination={{ ...processRunsTableProps.pagination, showSizeChanger: false }}
          rowKey="id"
          rowClassName={() => "entity-table-row"}
        >
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value, record: { status?: string; result?: string }) => {
              const state = getRunState(record?.status || value, record?.result);
              return (
                <Space size={8}>
                  <Tag className={`run-status-chip run-status-chip--${state}`}>{state}</Tag>
                </Space>
              );
            }}
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
            render={(value, record: { status?: string; result?: string }) => {
              const state = getRunState(record?.status, record?.result || value);
              return (
                <Space size={8}>
                  <Tag className={`run-status-chip run-status-chip--${state}`}>{state}</Tag>
                </Space>
              );
            }}
            sorter
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select allowClear className="filter-dropdown__select">
                  <Select.Option value="success">Success</Select.Option>
                  <Select.Option value="warning">Warning</Select.Option>
                  <Select.Option value="failed">Failed</Select.Option>
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
          <Table.Column
            dataIndex="created_at"
            title="Created At"
            render={(value) => (value ? <DateField value={value} format="LLL" /> : null)}
            sorter
          />
          <Table.Column
            dataIndex={["user"]}
            title="User"
            render={(value) =>
              userIsLoading ? <>Loading...</> : userData?.find((item) => item.id === value)?.email
            }
            sorter
          />
          <Table.Column dataIndex="error_message" title="Message" sorter />
        </Table>
      </div>
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
        className="entity-tabs"
        defaultActiveKey="1"
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
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
