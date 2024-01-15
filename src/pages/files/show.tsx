import { DateField, NumberField, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Button, Typography, Upload, notification } from "antd";
import { UploadProps } from "antd/lib";
import { ACCESS_TOKEN_KEY, API_URL } from "../../authProvider";

const { Title } = Typography;

export const FileShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const props: UploadProps = {
    name: "file",
    action: `${API_URL}/files/${record?.id}/upload/`,
    accept: "image/*,.pdf",
    maxCount: 1,
    headers: {
      authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      "Content-Disposition": 'attachment; filename="testname"',
    },
    data: {
      filename: "testname",
    },
    onChange(info) {
      if (info.file.status === "done") {
        notification.error({
          message: "Upload successfully.",
        });
      } else if (info.file.status === "error") {
        notification.error({
          message: "Upload failed.",
        });
      }
    },
  };

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {/* {defaultButtons} */}
          <Upload {...props}>
            <Button type="primary">Upload the file</Button>
          </Upload>
        </>
      )}
    >
      <Title level={5}>Id</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>Code</Title>
      <TextField value={record?.code ?? ""} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Created At</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>Format</Title>
      <TextField value={record?.format_label ?? ""} />
      <Title level={5}>Processor</Title>
      <TextField value={record?.processor_label ?? ""} />
      <Title level={5}>User params</Title>
      <TextField value={record?.user_params ?? ""} />
      <Title level={5}>System params</Title>
      <TextField value={record?.system_params ?? ""} />
      <Title level={5}>Linked process</Title>
      <TextField value={record?.linked_process ?? ""} />
    </Show>
  );
};
