import { DateField, List, Show, TextField, useTable } from "@refinedev/antd";
import {
  CanAccess,
  IResourceComponentsProps,
  useMany,
  useOne,
  useShow,
} from "@refinedev/core";
import { Table, Tag, Typography } from "antd";
import prettyBytes from "pretty-bytes";
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
      <Title level={5}>Code</Title>
      <TextField value={record?.code ?? ""} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Tags</Title>
      <Typography.Paragraph>
        {record?.tags?.map((tag: string[]) => (
          <Tag>{tag}</Tag>
        ))}
      </Typography.Paragraph>
      <Title level={5}>Format</Title>
      {record?.format &&
        (formatIsLoading ? <>Loading...</> : <>{formatData?.data?.format}</>)}
      <Title level={5}>Processor</Title>
      {record?.processor &&
        (processorIsLoading ? (
          <>Loading...</>
        ) : (
          <>{processorData?.data?.name}</>
        ))}
      <Title level={5}>User params</Title>
      <TextField value={record?.user_params ?? ""} />
      <Title level={5}>System params</Title>
      <TextField value={record?.system_params ?? ""} />
      <Title level={5}>Linked process</Title>
      {record?.linked_process &&
        (processIsLoading ? <>Loading...</> : <>{processData?.data?.code}</>)}
      <CanAccess resource="fileuploads" action="show">
        <List
          title="Uploads"
          breadcrumb={false}
          canCreate={false}
          resource="fileuploads"
        >
          <Table
            {...uploadTableProps}
            pagination={{
              ...uploadTableProps.pagination,
              showSizeChanger: false,
            }}
            rowKey="id"
          >
            <Table.Column dataIndex="name" title="Name" />
            <Table.Column
              dataIndex="size"
              title="Size"
              render={(value) => prettyBytes(value)}
            />
            <Table.Column
              dataIndex="created_at"
              title="Created At"
              render={(value) => <DateField value={value} format="LLL" />}
            />
            <Table.Column
              dataIndex={["user"]}
              title="User"
              render={(value) =>
                userIsLoading ? (
                  <>Loading...</>
                ) : (
                  userData?.data?.find((item) => item.id === value)?.email
                )
              }
            />
          </Table>
        </List>
      </CanAccess>
    </Show>
  );
};
