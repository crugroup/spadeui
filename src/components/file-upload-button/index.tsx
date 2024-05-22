import { UploadOutlined } from "@ant-design/icons";
import { BaseKey, useCan, useInvalidate, useOne, useResource } from "@refinedev/core";
import validator from "@rjsf/validator-ajv8";
import type { GetProp } from "antd";
import { Button, Modal, Space, Typography, Upload, UploadFile, UploadProps, notification } from "antd";
import { ButtonProps } from "antd/lib";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { FC, useMemo, useState } from "react";
import { RjsfForm } from "../rjsf-form/rjsf-form";
import { API_URL, ACCESS_TOKEN_KEY } from "../../config/constants";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type FileUploadButtonProps = {
  buttonProps: ButtonProps;
  recordItemId?: BaseKey;
  hideText?: boolean;
};

const FileUploadButton: FC<FileUploadButtonProps> = ({ buttonProps, recordItemId, hideText }) => {
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
  const [selectedFile, setSelectedFile] = useState<UploadFile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFileName = useMemo(
    () => selectedFile?.name ?? `File uploaded at ${new Date().toISOString()}`,
    [selectedFile?.name]
  );

  const onSubmit = async ({ formData }: { formData?: FormData }) => {
    // Upload the file
    setIsLoading(true);

    if (formData == null) {
      formData = new FormData();
    }

    const form = new FormData();
    form.append("file", selectedFile as FileType);
    form.append("filename", uploadFileName);
    form.append("params", JSON.stringify(formData));

    try {
      const resp = await axios.post(`${API_URL}/files/${recordItemId ?? id}/upload`, form, {
        headers: {
          authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          "Content-Disposition": `attachment; filename="${uploadFileName}"`,
        },
      });
      if (resp.data.result === "failed") {
        notification.error({ message: resp.data.error_message ?? "File upload failed" });
        setSelectedFile(undefined);
      } else {
        notification.success({ message: "File uploaded successfully" });
        setSelectedFile(undefined);
        setIsModalOpen(false);
      }
    } catch {
      notification.error({ message: "File upload failed" });
      setSelectedFile(undefined);
    }

    invalidate({
      resource: "fileuploads",
      invalidates: ["list"],
    });
    setIsLoading(false);
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => setIsModalOpen(true)}
        disabled={!permissionData?.can}
        title={permissionData?.can ? undefined : "You don't have permissions to access"}
        icon={<UploadOutlined />}>
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
        className="file-upload-button__modal">
        <Upload
          showUploadList={false}
          type="drag"
          onRemove={() => {
            setSelectedFile(undefined);
          }}
          beforeUpload={(file) => {
            setSelectedFile(file);

            return false;
          }}
          fileList={selectedFile ? [selectedFile] : []}>
          <Space>
            <Typography.Title level={5} className="file-upload-button__text">
              {selectedFile
                ? `${selectedFile.name} (${prettyBytes(selectedFile.size ?? 0)})`
                : "Select file for upload"}
            </Typography.Title>
          </Space>
        </Upload>
        {selectedFile && (
          <RjsfForm schema={fileData?.data?.user_params ?? {}} validator={validator} onSubmit={onSubmit}>
            <Space align="start">
              <Button disabled={isLoading} htmlType="submit" type="primary">
                Submit
              </Button>
              <Button onClick={() => setSelectedFile(undefined)}>Clear</Button>
            </Space>
          </RjsfForm>
        )}
      </Modal>
    </>
  );
};

export { FileUploadButton };
