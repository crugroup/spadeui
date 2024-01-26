import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { Layout as AntdLayout, Space, Typography, theme } from "antd";
import { UserData } from "../../authProvider";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<UserData>();

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
        <Space style={{ marginLeft: "8px" }} size="middle">
          <Text strong>{user?.fullName || user?.email}</Text>
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
