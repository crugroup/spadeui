import { Card, Col, Row, Typography } from "antd";
import { useCustomMutation } from "@refinedev/core";
import formatAxiosErrors from "../../../helpers/format-axios-errors";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import WarningIcon from "../../../../public/icons/warning-icon";
import { API_URL } from "../../../config/constants";

export const ConfirmEmail = () => {
  const navigate = useNavigate();
  const { mutate, isError } = useCustomMutation();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (!token) {
      navigate("/register");
    }

    mutate(
      {
        url: `${API_URL}/registration/confirm-email/${token}`,
        method: "post",
        values: {
          key: token,
        },
        successNotification: () => ({
          message: "Your account has been successfully activated. You can now login.",
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
          navigate("/login");
        },
      }
    );
  }, []);

  const loadingContent = (
    <>
      <LoadingOutlined />
      <Typography.Title level={3}>We&apos;re just activating your account...</Typography.Title>
      <Typography.Paragraph>
        Please be patient for a while, we are just now activating your account.
      </Typography.Paragraph>
    </>
  );

  const errorContent = (
    <>
      <WarningIcon />
      <Typography.Title level={3}>There was an error during account activation.</Typography.Title>
      <Typography.Paragraph>Check if the activation link from the email is still valid.</Typography.Paragraph>
    </>
  );

  return (
    <Row justify="center" align="middle" style={{ minHeight: "80vh" }}>
      <Col span={12}>
        <Card className="text-center">{isError ? errorContent : loadingContent}</Card>
      </Col>
    </Row>
  );
};
