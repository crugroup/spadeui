import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      title="Spadeshaft"
      type="login"
      rememberMe={false}
      registerLink={false}
    />
  );
};
