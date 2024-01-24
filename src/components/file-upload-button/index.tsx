import { ImportOutlined } from "@ant-design/icons";
import {
  BaseKey,
  useCan,
  useInvalidate,
  useOne,
  useResource,
} from "@refinedev/core";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import type { GetProp } from "antd";
import {
  Button,
  Modal,
  Space,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  notification,
} from "antd";
import { ButtonProps } from "antd/lib";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { FC, useState } from "react";
import { ACCESS_TOKEN_KEY, API_URL } from "../../authProvider";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type FileUploadButtonProps = {
  buttonProps: ButtonProps;
  recordItemId?: BaseKey;
  hideText?: boolean;
};

const FileUploadButton: FC<FileUploadButtonProps> = ({
  buttonProps,
  recordItemId,
  hideText,
}) => {
  const { id } = useResource();
  const invalidate = useInvalidate();

  const { data: fileData } = useOne({
    resource: "files",
    id: recordItemId ?? id,
  });

  const { data: permissionData } = useCan({
    action: "create",
    resource: "fileuploads",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadFile | undefined>(
    undefined
  );

  const onSubmit = async ({ formData }: { formData?: FormData }) => {
    // Upload the file
    const form = new FormData();
    form.append("file", selectedFile as FileType);
    form.append("filename", selectedFile?.name ?? "");
    form.append("params", JSON.stringify(formData));

    const fileUploadResponse = await axios.post(
      `${API_URL}/files/${recordItemId ?? id}/upload`,
      form,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          "Content-Disposition": `attachment; filename="${selectedFile?.name}"`,
        },
      }
    );

    if (fileUploadResponse.status === 200) {
      notification.success({ message: "File uploaded successfully" });
      setSelectedFile(undefined);
      setIsModalOpen(false);
    } else {
      notification.error({ message: "File upload failed" });
      setSelectedFile(undefined);
    }

    invalidate({
      resource: "fileuploads",
      invalidates: ["list"],
    });
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => setIsModalOpen(true)}
        disabled={!permissionData?.can}
        title={
          permissionData?.can
            ? undefined
            : "You don't have permissions to access"
        }
        icon={<ImportOutlined />}
      >
        {!hideText && "File upload"}
      </Button>
      <Modal
        title="File upload form"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedFile(undefined);
        }}
        footer={<></>}
      >
        <Upload
          style={{ marginBottom: 24 }}
          showUploadList={false}
          type="drag"
          onRemove={() => {
            setSelectedFile(undefined);
          }}
          beforeUpload={(file) => {
            setSelectedFile(file);

            return false;
          }}
          fileList={selectedFile ? [selectedFile] : []}
        >
          <Space style={{ minHeight: 60 }}>
            <Typography.Title level={5}>
              {selectedFile
                ? `${selectedFile.name} (${prettyBytes(
                    selectedFile.size ?? 0
                  )})`
                : "Select file for upload"}
            </Typography.Title>
          </Space>
        </Upload>
        <Form
          disabled={!selectedFile}
          schema={JSON.parse(fileData?.data?.user_params ?? "{}")}
          validator={validator}
          onSubmit={onSubmit}
        >
          <Space align="start">
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
            <Button onClick={() => setSelectedFile(undefined)}>Clear</Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export { FileUploadButton };
