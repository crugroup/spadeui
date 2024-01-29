import { DateField, List, Show, TextField, useTable } from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useGetToPath,
  useMany,
  useOne,
  useResource,
  useShow,
} from "@refinedev/core";
import { Divider, Input, Table, Tag, Typography } from "antd";
import prettyBytes from "pretty-bytes";
import { Link } from "react-router-dom";
import { FileUploadButton } from "../../components";
import { DEFAULT_PAGE_SIZE } from "../../rest-data-provider";

const { Title } = Typography;

export const FileShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { tableProps: uploadTableProps } = useTable({
    syncWithLocation: true,
    resource: "fileuploads",
    pagination: {
      pageSize: DEFAULT_PAGE_SIZE,
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

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <FileUploadButton buttonProps={{ type: "primary" }} />
        </>
      )}>
      <Title level={5}>Code</Title>
      <TextField value={record?.code ?? ""} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Tags</Title>
      <Typography.Paragraph>{record?.tags?.map((tag: string) => <Tag key={tag}>{tag}</Tag>)}</Typography.Paragraph>
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
      <Title level={5}>User params</Title>
      <Typography.Paragraph>
        <Input.TextArea value={record?.user_params ?? ""} readOnly rows={8} style={{ fontFamily: "monospace" }} />
      </Typography.Paragraph>
      <Title level={5}>System params</Title>
      <Typography.Paragraph>
        <Input.TextArea value={record?.system_params ?? ""} readOnly rows={8} style={{ fontFamily: "monospace" }} />
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
      <CanAccess resource="fileuploads" action="show">
        <Divider />
        <List title="Uploads" breadcrumb={false} canCreate={false} resource="fileuploads">
          <Table
            {...uploadTableProps}
            pagination={{
              ...uploadTableProps.pagination,
              showSizeChanger: false,
            }}
            rowKey="id">
            <Table.Column dataIndex="name" title="Name" />
            <Table.Column dataIndex="size" title="Size" render={(value) => prettyBytes(value)} />
            <Table.Column
              dataIndex="created_at"
              title="Created At"
              render={(value) => <DateField value={value} format="LLL" />}
            />
            <Table.Column
              dataIndex={["user"]}
              title="User"
              render={(value) =>
                userIsLoading ? <>Loading...</> : userData?.data?.find((item) => item.id === value)?.email
              }
            />
          </Table>
        </List>
      </CanAccess>
    </Show>
  );
};
