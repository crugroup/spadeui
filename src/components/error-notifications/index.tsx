import { Alert, Form, FormProps, Input, Typography } from "antd";
import { FC } from "react";

type ErrorsNotificationProps = {
  formProps: FormProps;
};

const ErrorNotifications: FC<ErrorsNotificationProps> = ({ formProps }) => {
  const nonFieldErrors = formProps?.form?.getFieldError("non_field_errors");

  const notificationBar = nonFieldErrors?.map((error) => (
    <Typography.Paragraph>
      <Alert key={error} message={error} type="error" />
    </Typography.Paragraph>
  ));

  const hiddenField = (
    <Form.Item hidden name={["non_field_errors"]}>
      <Input />
    </Form.Item>
  );

  return (
    <>
      {notificationBar}
      {hiddenField}
    </>
  );
};

export { ErrorNotifications };
