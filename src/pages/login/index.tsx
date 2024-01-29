import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return <AuthPage title={<img src="/public/logos/spade-logo.svg" />} type="login" rememberMe={false} registerLink={false} />;
};
