import { PlayCircleOutlined } from "@ant-design/icons";
import { BaseKey, useCan, useCustomMutation, useInvalidate, useOne, useResource } from "@refinedev/core";
import validator from "@rjsf/validator-ajv8";
import { Button, Modal, Space } from "antd";
import { ButtonProps } from "antd/lib";
import { FC, useState } from "react";
import { API_URL } from "../../auth-provider";
import { RjsfForm } from "../rjsf-form/rjsf-form";

type ProcessRunButtonProps = {
  buttonProps: ButtonProps;
  recordItemId?: BaseKey;
  hideText?: boolean;
};

const ProcessRunButton: FC<ProcessRunButtonProps> = ({ buttonProps, recordItemId, hideText }) => {
  const { id } = useResource();
  const { mutate } = useCustomMutation();
  const invalidate = useInvalidate();

  const { data: processData } = useOne({
    resource: "processes",
    id: recordItemId ?? id,
  });

  const { data: permissionData } = useCan({
    action: "create",
    resource: "processruns",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async ({ formData }: { formData?: FormData }) => {
    mutate(
      {
        url: `${API_URL}/processes/${recordItemId ?? id}/run`,
        method: "post",
        values: {
          params: JSON.stringify(formData) ?? {},
        },
        successNotification: () => ({
          message: "The process was launched successfuly",
          type: "success",
          description: "Success",
        }),
        errorNotification: (err) => {
          return {
            message: err?.response.data.error_message || err?.message || "Something went wrong",
            type: "error",
            description: "Error",
          };
        },
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );

    invalidate({
      resource: "processruns",
      invalidates: ["list"],
    });
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => setIsModalOpen(true)}
        disabled={!permissionData?.can}
        title={permissionData?.can ? undefined : "You don't have permissions to access"}
        icon={<PlayCircleOutlined />}
      >
        {!hideText && "Run process"}
      </Button>
      <Modal
        title="Process run form"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={<></>}
      >
        <RjsfForm schema={processData?.data?.user_params ?? {}} validator={validator} onSubmit={onSubmit}>
          <Space align="start">
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        </RjsfForm>
      </Modal>
    </>
  );
};

export { ProcessRunButton };
