import { PlayCircleOutlined } from "@ant-design/icons";
import { BaseKey, useCan, useCustomMutation, useInvalidate, useOne, useParsed } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";
import validator from "@rjsf/validator-ajv8";
import { Button, Modal, Space, App, Typography } from "antd";
import { ButtonProps } from "antd/lib";
import { FC, useState } from "react";
import { RjsfForm } from "../rjsf-form/rjsf-form";
import { API_URL } from "../../config/constants";

const { Text } = Typography;

type ProcessRunButtonProps = {
  buttonProps: ButtonProps;
  recordItemId?: BaseKey;
  hideText?: boolean;
};

const ProcessRunButton: FC<ProcessRunButtonProps> = ({ buttonProps, recordItemId, hideText }) => {
  const { notification } = App.useApp();
  const { id } = useParsed();
  const { isLoading, mutate } = useCustomMutation();
  const invalidate = useInvalidate();
  const queryClient = useQueryClient();
  const targetId = recordItemId ?? id;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { result: processData } = useOne({
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

          // Optimistic update: immediately show "running" status in the
          // dashboard / processes list before the API confirms it.
          queryClient.setQueriesData(
            { queryKey: ["dashboard", "latest_runs"], exact: false },
            (old: any) => {
              if (!Array.isArray(old)) return old;
              return old.map((item: any) =>
                String(item.process_id) === String(targetId)
                  ? { ...item, latest_run: { ...item.latest_run, status: "running" } }
                  : item
              );
            }
          );

          // Invalidate dashboard React Query cache after a short delay so
          // the backend has time to start the process before we refetch.
          const refetchLatestRuns = () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "latest_runs"] });
          };
          setTimeout(refetchLatestRuns, 1000);
          setTimeout(refetchLatestRuns, 4000);
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
        title={
          <Space>
            <PlayCircleOutlined style={{ color: "var(--spade-muted)" }} />
            <span>Run {processData?.code ? <Text code>{processData.code}</Text> : "process"}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={isLoading}
              htmlType="submit"
              form="process-run-form"
            >
              Run process
            </Button>
          </div>
        }
        width={560}
        className="workflow-modal"
      >
        {processData?.description && (
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>{processData.description}</Text>
        )}
        <RjsfForm
          id="process-run-form"
          schema={processData?.user_params ?? {}}
          validator={validator}
          onSubmit={onSubmit}
          noHtml5Validate
        >
          <div style={{ display: "none" }}>
            <button type="submit" />
          </div>
        </RjsfForm>
      </Modal>
    </>
  );
};

export { ProcessRunButton };
