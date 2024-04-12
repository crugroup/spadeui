import { AuthPage } from "@refinedev/antd";
import { ACCOUNT_CONFIRMATION_REQUIRED } from "../../../config/constants";

export const Login = () => {
  return (
    <AuthPage
      title={<img src="/public/logos/spade-logo.svg" />}
      type="login"
      rememberMe={false}
      registerLink={ACCOUNT_CONFIRMATION_REQUIRED ? undefined : false} // probably its a bug from Refine. If we want registerLink it must to be 'undefined' instead of 'true'
    />
  );
};
