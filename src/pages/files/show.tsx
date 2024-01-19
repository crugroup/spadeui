import { DateField, List, Show, TextField, useTable } from "@refinedev/antd";
import { IResourceComponentsProps, useOne, useShow } from "@refinedev/core";
import { Table, Typography } from "antd";
import prettyBytes from "pretty-bytes";
import { FileUploadButton } from "../../components";

const { Title } = Typography;

export const FileShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const { tableProps: uploadTableProps } = useTable({
    syncWithLocation: true,
    resource: "fileuploads",
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
      <List
        title="Uploads"
        breadcrumb={false}
        canCreate={false}
        resource="fileuploads"
      >
        <Table {...uploadTableProps} rowKey="id">
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
        </Table>
      </List>
    </Show>
  );
};
