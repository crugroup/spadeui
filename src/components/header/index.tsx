import React, { useContext } from "react";
import LogoutIcon from "../../../public/icons/logout-icon";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { UserData } from "../../config/auth-provider";
import { Layout as AntdLayout, Space, Typography, theme, Button, Dropdown } from "antd";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import { SettingOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { MenuProps } from "antd/lib";
import { Link } from "react-router";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutHeaderProps> = () => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<UserData>();
  const { mode, setMode } = useContext(ThemeProviderContext);
  const { mutate: logout } = useLogout();
  const userLabel = user?.fullName || user?.email || "User";
  const userInitial = userLabel?.trim()?.[0]?.toUpperCase() || "U";

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/update-password">Change password</Link>,
    },
    {
      key: "2",
      label: (
        <Link to="https://crugroup.github.io/spade/" target="_blank" rel="noopener noreferrer">
          Documentation
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to="https://getspade.io/" target="_blank" rel="noopener noreferrer">
          About
        </Link>
      ),
    },
  ];

  return (
    <AntdLayout.Header className="app-header" style={{ backgroundColor: token.colorBgElevated }}>
      <Space className="app-header__content" size="middle">
        <div className="app-header__identity">
          <span className="app-header__avatar">{userInitial}</span>
          <Text strong className="app-header__name">
            {userLabel}
          </Text>
        </div>
        <Space size="middle">
          <Button
            className="btn-vertical-align app-header__icon-btn"
            type="text"
            size="small"
            icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => setMode()}
            title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          />
          <Space>
            <Dropdown menu={{ items }} placement="bottom">
              <Button
                className="btn-vertical-align app-header__icon-btn"
                type="text"
                size="small"
                icon={<SettingOutlined />}
              ></Button>
            </Dropdown>
          </Space>
          <Button
            className="btn-vertical-align app-header__logout"
            onClick={() => logout()}
            type="text"
            size="small"
            icon={<LogoutIcon />}
          >
            <span className="logout-text">Logout</span>
          </Button>
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
