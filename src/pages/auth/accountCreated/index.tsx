import EmailIcon from "../../../../public/icons/email-icon";
import formatAxiosErrors from "../../../helpers/format-axios-errors";
import { Button, Card, Col, Row, Typography } from "antd";
import { useCustomMutation } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_TEMP_DATA_KEY, API_URL } from "../../../config/constants";

export const AccountCreated = () => {
  const { mutate } = useCustomMutation();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const email = sessionStorage.getItem(USER_TEMP_DATA_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, []);

  const sendEmail = () => {
    mutate(
      {
        url: `${API_URL}/registration/resend-verification-email`,
        method: "post",
        values: {
          email,
        },
        successNotification: () => ({
          message: "The email has been sent successfully",
          type: "success",
          description: "Success",
        }),
        errorNotification: (err) => {
          return {
            message: formatAxiosErrors(err?.response?.data),
            type: "error",
            description: "Error",
          };
        },
      },
      {
        onSuccess: () => {
          setBtnDisabled(true);
        },
      }
    );
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "80vh" }}>
      <Col span={12}>
        <Card className="text-center">
          <EmailIcon />
          <Typography.Title level={3}>Congratulations! Your account has been created.</Typography.Title>
          <Typography.Paragraph>Email message didn't reach you? You can send it again.</Typography.Paragraph>
          <Button type="primary" onClick={sendEmail} disabled={btnDisabled}>
            Send email again
          </Button>
        </Card>
      </Col>
    </Row>
  );
};
