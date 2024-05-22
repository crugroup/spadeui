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
import prettyBytes from "pretty-bytes";
import { Link } from "react-router-dom";
import { FileUploadButton } from "../../components";
import { SystemParamsTooltip, UserParamsTooltip } from "../../components/common-tooltips";
import { JsonField } from "../../components/json-field/json-field";
import { DEFAULT_PAGE_SIZE } from "../../config/rest-data-provider";
import IconStatusMapper from "../../components/icon-status-mapper/icon-status-mapper";
import React from "react";

const { Title } = Typography;

export const FileShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

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

  const definitionsTab = (
    <>
      <Title level={5}>Code</Title>
      <TextField value={record?.code ?? ""} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Tags</Title>
      <Typography.Paragraph>
        {record?.tags?.toSorted((a: string, b: string) => a.localeCompare(b)).map((tag: string) => <Tag key={tag}>{tag}</Tag>)}
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
              }>
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
              }>
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
              }>
              {processData?.data?.code}
            </Link>
          ))}
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
    </>
  );

  const historyTab = (
    <CanAccess resource="fileuploads" action="show">
      <List title={<></>} breadcrumb={false} canCreate={false} resource="fileuploads">
        <Table
          {...uploadTableProps}
          pagination={{
            ...uploadTableProps.pagination,
            showSizeChanger: false,
          }}
          rowKey="id">
          <Table.Column dataIndex="name" title="Name" sorter />
          <Table.Column
            dataIndex="result"
            title="Result"
            render={(value) => <IconStatusMapper status={value} />}
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
          <Table.Column
            dataIndex="error_message"
            title="Message"
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
          <FileUploadButton buttonProps={{ type: "primary" }} />
        </>
      )}>
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
