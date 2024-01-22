import { ImportButton } from "@refinedev/antd";
import { BaseKey, useCan, useInvalidate, useResource } from "@refinedev/core";
import { UploadProps, notification } from "antd";
import { ButtonProps } from "antd/lib";
import { FC } from "react";
import { ACCESS_TOKEN_KEY, API_URL } from "../../authProvider";

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

  const { data } = useCan({
    action: "create",
    resource: "fileuploads",
  });

  const fileUploadProps: UploadProps = {
    action: `${API_URL}/files/${recordItemId ?? id}/upload`,
    accept: "image/*,.pdf",
    maxCount: 1,
    headers: {
      authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      "Content-Disposition": "attachment;",
    },
    showUploadList: false,
    data: (file) => ({
      filename: file.name,
    }),
    onChange(info) {
      if (info.file.status === "done") {
        notification.success({
          message: "Upload successfully.",
        });
      } else if (info.file.status === "error") {
        notification.error({
          message: "Upload failed.",
        });
      }

      // This makes sure that if a list of file uploads is currently rendered, it gets refreshed
      invalidate({
        resource: "fileuploads",
        invalidates: ["list"],
      });
    },
  };

  return (
    <ImportButton
      hideText={hideText}
      uploadProps={fileUploadProps}
      buttonProps={{
        ...buttonProps,
        disabled: !data?.can,
        title: data?.can ? undefined : "You don't have permissions to access",
      }}
    >
      Upload
    </ImportButton>
  );
};

export { FileUploadButton };
