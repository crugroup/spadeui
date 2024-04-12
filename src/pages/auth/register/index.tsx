import { AuthPage, useForm } from "@refinedev/antd";
import { useRegister } from "@refinedev/core";
import { Button, Form, Input } from "antd";
import { Children, ReactElement, ReactNode, cloneElement, isValidElement } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../components/logo";

export const Register = () => {
  const { formProps } = useForm();
  const { mutate: register } = useRegister();

  const handleSubmit = (values: { [key: string]: string }) => {
    register(values);
  };

  return (
    <AuthPage
      type="register"
      renderContent={(content: ReactNode) => {
        const newForm = (
          <Form {...formProps} layout="vertical" onFinish={handleSubmit} className="register-form">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                },
                {
                  type: "email",
                  message: "Invalid email address",
                },
              ]}>
              <Input placeholder="Email" type="email" size="large" />
            </Form.Item>
            <Form.Item
              label="First name"
              name="first_name"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input placeholder="First name" type="text" size="large" />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="last_name"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input placeholder="Last name" type="text" size="large" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input placeholder="Password" type="password" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Sign up
              </Button>
            </Form.Item>
            <p className="have-account">
              Have an account?{" "}
              <Link to="/login">
                <b>Sign in</b>
              </Link>
            </p>
          </Form>
        );

        // I'm replacing the default form with the new one leaving everything else
        // so we don't have to create the whole page from scratch
        if (isValidElement(content)) {
          const newChildren = Children.map(content?.props.children, (child) => {
            if (isValidElement(child) && (child as ReactElement).type === Form) {
              return newForm;
            }

            return child;
          });

          return (
            <>
              <div className="register-logo-holder">
                <Logo />
              </div>
              {cloneElement(content, (content as ReactElement).props, newChildren)}
            </>
          );
        }

        return null;
      }}
    />
  );
};
