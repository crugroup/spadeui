import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return <AuthPage title="SpadeShaft" type="login" rememberMe={false} registerLink={false} />;
};
