import { AuthPage } from "@refinedev/antd";
import { Logo } from "../../../components/logo";

export const ForgotPassword = () => {
  return <AuthPage title={<Logo />} type="forgotPassword" renderContent={(content) => <div className="auth-surface">{content}</div>} />;
};
