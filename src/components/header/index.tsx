import React, { useContext } from "react";
import LogoutIcon from "../../../public/icons/logout-icon";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { UserData } from "../../auth-provider";
import { Layout as AntdLayout, Space, Typography, Switch, theme, Button } from "antd";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<UserData>();
  const { mode, setMode } = useContext(ThemeProviderContext);
  const { mutate: logout } = useLogout();

  return (
    <AntdLayout.Header style={{ backgroundColor: token.colorBgElevated }}>
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
