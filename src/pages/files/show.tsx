import { DateField, FilterDropdown, Show, TextField, useTable } from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useGetToPath,
  useMany,
  useOne,
  useResource,
  useShow,
} from "@refinedev/core";
import { Select, Space, Table, Tabs, Tag, Typography } from "antd";
import prettyBytes from "pretty-bytes";
import { Link } from "react-router-dom";
import { FileUploadButton } from "../../components";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import { JsonField } from "../../components/json-field/json-field";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";
import React from "react";

const { Title } = Typography;

export const FileShow: React.FC<IResourceComponentsProps> = () => {
  const { query } = useShow();
  const { data, isLoading } = query;

  const record = data?.data;

  const { tableProps: uploadTableProps } = useTable({
    syncWithLocation: false,
    resource: "fileuploads",
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
    },
    filters: {
      permanent: [{ field: "file", value: record?.id, operator: "eq" }],
    },
  });

  const { data: formatData, isLoading: formatIsLoading } = useOne({
    resource: "fileformats",
    id: record?.format ?? "",
    queryOptions: {
      enabled: !!record?.format,
    },
  });

  const { data: processorData, isLoading: processorIsLoading } = useOne({
    resource: "fileprocessors",
    id: record?.processor ?? "",
    queryOptions: {
      enabled: !!record?.processor,
    },
  });

  const { data: processData, isLoading: processIsLoading } = useOne({
    resource: "processes",
    id: record?.linked_process ?? "",
    queryOptions: {
      enabled: !!record?.linked_process,
    },
  });

  const { data: variableSetsData, isLoading: variableSetsIsLoading } = useMany({
    resource: "variable-sets",
    ids: record?.variable_sets || [],
    queryOptions: {
      enabled: !!record?.variable_sets?.length,
    },
  });

  const { data: userData, isLoading: userIsLoading } = useMany({
    resource: "users",
    ids: uploadTableProps?.dataSource?.map((item) => item?.user) ?? [],
    queryOptions: {
      enabled: !!uploadTableProps?.dataSource,
    },
  });

  const getToPath = useGetToPath();

  const fileFormatResource = useResource("fileformats").resource;
  const processResource = useResource("processes").resource;
  const fileProcessorResource = useResource("fileprocessors").resource;
  const variableSetResource = useResource("variable-sets").resource;

  const getRunState = (status?: string, result?: string) => {
    const normalizedStatus = status?.toLowerCase();
    const normalizedResult = result?.toLowerCase();

    if (normalizedStatus === "running" || normalizedStatus === "new") return "running";
    if (
      normalizedStatus === "error" ||
      normalizedResult === "failed" ||
      normalizedResult === "error" ||
      normalizedResult === "warning"
    )
      return "failed";
    if (normalizedResult === "success" || normalizedStatus === "finished") return "success";
    return "failed";
  };

  const definitionsTab = (
    <div className="entity-show-shell">
      <Title level={5}>Name</Title>
      <TextField value={record?.code ?? ""} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Tags</Title>
      <Typography.Paragraph>
        <div className="file-tags-wrap">
          {record?.tags?.map((tag: string) => (
            <Tag className="entity-tag" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
      </Typography.Paragraph>
      <Title level={5}>Format</Title>
      <Typography.Paragraph>
        {record?.format &&
          (formatIsLoading ? (
            <>Loading...</>
          ) : (
            <Link
              to={
                getToPath({
                  resource: fileFormatResource,
                  action: "show",
                  meta: { id: record?.format },
                }) ?? "#"
              }
            >
              {formatData?.data?.format}
            </Link>
          ))}
      </Typography.Paragraph>
      <Title level={5}>Processor</Title>
      <Typography.Paragraph>
        {record?.processor &&
          (processorIsLoading ? (
            <>Loading...</>
          ) : (
            <Link
              to={
                getToPath({
                  resource: fileProcessorResource,
                  action: "show",
                  meta: { id: record?.processor },
                }) ?? "#"
              }
            >
              {processorData?.data?.name}
            </Link>
          ))}
      </Typography.Paragraph>
      <Title level={5}>Linked process</Title>
      <Typography.Paragraph>
        {record?.linked_process &&
          (processIsLoading ? (
            <>Loading...</>
          ) : (
            <Link
              to={
                getToPath({
                  resource: processResource,
                  action: "show",
                  meta: { id: record?.linked_process },
                }) ?? "#"
              }
            >
              {processData?.data?.code}
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
                if (!variableSet) return "undefined";
                return (
                  <span key={variableSet.id}>
                    <Link
                      to={
                        getToPath({
                          resource: variableSetResource,
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
        <UserParamsTooltip />
      </Title>
      <Typography.Paragraph>{record?.user_params && <JsonField value={record?.user_params} />}</Typography.Paragraph>
      <Title level={5}>
        <SystemParamsTooltip />
      </Title>
      <Typography.Paragraph>
        {record?.system_params && <JsonField value={record?.system_params} />}
      </Typography.Paragraph>
    </div>
  );

  const historyTab = (
    <CanAccess resource="fileuploads" action="show">
      <div className="entity-table-shell entity-table-shell--flat">
        <Table
          {...uploadTableProps}
          pagination={{
            ...uploadTableProps.pagination,
            showSizeChanger: false,
          }}
          rowKey="id"
          rowClassName={() => "entity-table-row"}
        >
          <Table.Column dataIndex="name" title="Name" sorter />
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
                  <Select.Option value="error">Error</Select.Option>
                </Select>
              </FilterDropdown>
            )}
          />
          <Table.Column dataIndex="size" title="Size" render={(value) => prettyBytes(value)} sorter />
          <Table.Column dataIndex="rows" title="Rows" sorter />
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
          <FileUploadButton buttonProps={{ type: "primary" }} />
        </>
      )}
    >
      <Tabs
        className="entity-tabs"
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
