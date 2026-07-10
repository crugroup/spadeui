import { Edit } from "@refinedev/antd";
import { Button, Form, Input } from "antd";
import { ErrorNotifications } from "../../components/error-notifications";
import { useCustomMutation } from "@refinedev/core";
import { API_URL } from "../../config/constants";
import formatAxiosErrors from "../../helpers/format-axios-errors";

interface FormValues {
  new_password1: string;
  new_password2: string;
}

export const UpdatePasswordLoggedIn = () => {
  const [form] = Form.useForm<FormValues>();
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
          form.resetFields();
        },
      }
    );
  };

  return (
    <Edit
      title="Update password"
      headerButtons={() => (
        <Button type="primary" onClick={() => form.submit()}>
          Save
        </Button>
      )}
    >
      <Form form={form} onFinish={onSubmit as () => void} layout="vertical" className="entity-form">
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
