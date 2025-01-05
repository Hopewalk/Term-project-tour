import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
const items = [
  {
    label: "One day trip",
    key: "onedaytip",
    icon: <MailOutlined />,
  },
  {
    label: "Trip & Rest",
    key: "triprest",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Promotion",
    key: "promotion",
    icon: <SettingOutlined />,
  },
];
function logout() {
  localStorage.clear();
  window.location.href = "/";
}
const Nav = () => {
  const [current, setCurrent] = useState("");
  const onClick = (e) => {
    if (e.key === "logout") {
      logout();
    } else {
      setCurrent(e.key);
    }
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
export default Nav;
