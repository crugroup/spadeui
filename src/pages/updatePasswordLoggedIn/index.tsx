import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { ErrorNotifications } from "../../components/error-notifications";
import { useCustomMutation } from "@refinedev/core";
import { API_URL } from "../../config/constants";
import formatAxiosErrors from "../../helpers/format-axios-errors";

interface FormValues {
  new_password1: string;
  new_password2: string;
}

export const UpdatePasswordLoggedIn = () => {
  const { formProps, saveButtonProps } = useForm<FormValues>({ submitOnEnter: true, warnWhenUnsavedChanges: false });
  const { mutate } = useCustomMutation();

  const onSubmit = ({ new_password1, new_password2 }: FormValues) => {
    mutate(
      {
        url: `${API_URL}/password/change`,
        method: "post",
        values: {
          new_password1,
          new_password2,
        },
        successNotification: () => ({
          type: "success",
          message: "Password updated successfully",
        }),
        errorNotification: (err) => {
          return {
            message: formatAxiosErrors(err?.response?.data as unknown as { [key: string]: string[] }),
            type: "error",
            description: "Update Password Error",
          };
        },
      },
      {
        onSuccess: () => {
          formProps.form?.resetFields();
        },
      }
    );
  };

  return (
    <Edit title="Update password" saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={onSubmit as () => void} layout="vertical">
        <ErrorNotifications formProps={formProps} />
        <Form.Item
          label="New password"
          name="new_password1"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New password"
          name="new_password2"
          dependencies={["new_password1"]}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password1") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Edit>
  );
};
