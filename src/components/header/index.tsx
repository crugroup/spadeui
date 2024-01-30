import React, { useContext } from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { UserData } from "../../auth-provider";
import { Layout as AntdLayout, Space, Typography, Switch, theme, Button } from "antd";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import LogoutIcon from "../../../public/icons/logout-icon";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<UserData>();
  const { mode, setMode } = useContext(ThemeProviderContext);
  const { mutate: logout } = useLogout();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Switch
          checkedChildren="☾"
          unCheckedChildren="☼"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Space size="middle">
          <Text strong>{user?.fullName || user?.email}</Text>
          <Button
            className="btn-vertical-align"
            onClick={() => logout()}
            type="text"
            size="small"
            icon={<LogoutIcon />}>
            <span className="logout-text">Logout</span>
          </Button>
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
