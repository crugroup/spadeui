import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, NumberField, TagField, TextField, DateField } from "@refinedev/antd";
import { Button, Typography, Upload, notification } from "antd";
import { UploadProps } from "antd/lib";
import { ACCESS_TOKEN_KEY, API_URL } from "../../authProvider";

const { Title } = Typography;

const FileShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const props: UploadProps = {
    name: "file",
    action: `${API_URL}/files/${record?.id}/upload/`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
    },
    data: {
      filename: "testname",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        console.log(`${info.file.name} file upload failed.`);
        notification.error({
          message: "Upload failed",
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
      <NumberField value={record?.code ?? ""} />
      <Title level={5}>Description</Title>
      <TextField value={record?.description} />
      <Title level={5}>Created At</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>Format</Title>
      <NumberField value={record?.format ?? ""} />
      <Title level={5}>Processor</Title>
      <NumberField value={record?.processor ?? ""} />
    </Show>
  );
};

export const CategoryShow: React.FC<IResourceComponentsProps> = () => {
  return <FileShow />;
};
