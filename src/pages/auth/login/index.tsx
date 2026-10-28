import { AuthPage } from "@refinedev/antd";
import { ACCOUNT_CONFIRMATION_REQUIRED } from "../../../config/constants";

export const Login = () => {
  return (
    <AuthPage
      title={
        <div className="auth-brand">
          <img src="/public/logos/spade-logo.svg" />
        </div>
      }
      type="login"
      rememberMe={false}
      renderContent={(content) => <div className="auth-surface auth-surface--login">{content}</div>}
      registerLink={ACCOUNT_CONFIRMATION_REQUIRED ? undefined : false} // probably its a bug from Refine. If we want registerLink it must to be 'undefined' instead of 'true'
    />
  );
};
