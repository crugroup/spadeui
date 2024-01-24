import { PlayCircleOutlined } from "@ant-design/icons";
import {
  BaseKey,
  useCan,
  useDataProvider,
  useInvalidate,
  useOne,
  useResource,
} from "@refinedev/core";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import { Button, Modal, Space, notification } from "antd";
import { ButtonProps } from "antd/lib";
import Paragraph from "antd/lib/typography/Paragraph";
import { FC, useState } from "react";
import { API_URL } from "../../authProvider";

type ProcessRunButtonProps = {
  buttonProps: ButtonProps;
  recordItemId?: BaseKey;
  hideText?: boolean;
};

const ProcessRunButton: FC<ProcessRunButtonProps> = ({
  buttonProps,
  recordItemId,
  hideText,
}) => {
  const { id } = useResource();
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

  const dataProvider = useDataProvider();

  const onSubmit = async ({ formData }: { formData?: FormData }) => {
    const dp = dataProvider();

    // Run the process
    try {
      await dp?.custom?.({
        url: `${API_URL}/processes/${recordItemId ?? id}/run`,
        payload: {
          params: JSON.stringify(formData) ?? {},
        },
        method: "post",
      });

      notification.success({ message: "File uploaded successfully" });
      setIsModalOpen(false);
    } catch {
      notification.error({ message: "File upload failed" });
    }

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
        title={
          permissionData?.can
            ? undefined
            : "You don't have permissions to access"
        }
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
        <Form
          schema={JSON.parse(processData?.data?.user_params ?? "{}")}
          validator={validator}
          onSubmit={onSubmit}
        >
          {!processData?.data?.user_params && (
            <Paragraph>
              Form is empty. Set it up in process' user params or run the
              process now without passing any params.
            </Paragraph>
          )}
          <Space align="start">
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export { ProcessRunButton };
