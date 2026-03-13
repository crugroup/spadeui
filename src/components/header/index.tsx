import React, { useContext } from "react";
import LogoutIcon from "../../../public/icons/logout-icon";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { UserData } from "../../config/auth-provider";
import { Layout as AntdLayout, Space, Typography, Switch, theme, Button, Dropdown } from "antd";
import { ThemeProviderContext } from "../../contexts/theme-provider";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { SettingOutlined } from "@ant-design/icons";
import { MenuProps } from "antd/lib";
import { Link } from "react-router-dom";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
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
    {
      key: "4",
      label: (
        <>
          Toggle theme:&nbsp;
          <Switch
            checkedChildren="☾"
            unCheckedChildren="☼"
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
            defaultChecked={mode === "dark"}
          />
        </>
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
