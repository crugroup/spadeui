import { AuthPage } from "@refinedev/antd";
import { Logo } from "../../../components/logo";

export const UpdatePassword = () => {
  return <AuthPage title={<Logo />} type="updatePassword" renderContent={(content) => <div className="auth-surface">{content}</div>} />;
};
