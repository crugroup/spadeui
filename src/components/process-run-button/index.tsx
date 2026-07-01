import { PlayCircleOutlined } from "@ant-design/icons";
import { BaseKey, useCan, useCustomMutation, useInvalidate, useOne, useParsed } from "@refinedev/core";
import validator from "@rjsf/validator-ajv8";
import { Button, Modal, Space, notification } from "antd";
import { ButtonProps } from "antd/lib";
import { FC, useState } from "react";
import { RjsfForm } from "../rjsf-form/rjsf-form";
import { API_URL } from "../../config/constants";

type ProcessRunButtonProps = {
  buttonProps: ButtonProps;
  recordItemId?: BaseKey;
  hideText?: boolean;
};

const ProcessRunButton: FC<ProcessRunButtonProps> = ({ buttonProps, recordItemId, hideText }) => {
  const { identifier } = useParsed();
  const { isLoading, mutate } = useCustomMutation();
  const invalidate = useInvalidate();
  const targetId = recordItemId ?? identifier;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: processData } = useOne({
    resource: "processes",
    id: targetId,
    queryOptions: {
      enabled: isModalOpen && !!targetId,
    },
  });

  const { data: permissionData } = useCan({
    action: "create",
    resource: "processruns",
  });

  const onSubmit = async ({ formData }: { formData?: FormData }) => {
    const serializedParams = JSON.stringify(formData ?? {});

    mutate(
      {
        url: `${API_URL}/processes/${targetId}/run`,
        method: "post",
        values: {
          params: serializedParams,
        },
        successNotification: false,
        errorNotification: (err) => {
          return {
            message: err?.response?.data?.error_message || err?.message || "Something went wrong",
            type: "error",
            description: "Error",
          };
        },
      },
      {
        onSuccess: () => {
          notification.warning({
            message: "Process started",
            description: "Running",
          });
          setIsModalOpen(false);
        },
      }
    );

    invalidate({
      resource: "processruns",
      invalidates: ["list"],
    });
    invalidate({
      resource: "processes",
      invalidates: ["list", "detail"],
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
        className="workflow-modal"
      >
        <RjsfForm schema={processData?.data?.user_params ?? {}} validator={validator} onSubmit={onSubmit}>
          <Space align="start" className="workflow-modal__actions">
            <Button disabled={isLoading} htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        </RjsfForm>
      </Modal>
    </>
  );
};

export { ProcessRunButton };
