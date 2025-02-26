// Sidebar.tsx
import React from "react";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import SideBar from "../pages/client/homeAuth/SliderBar"; 
import './layout.scss'

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void; 
  location: {
    pathname: string; 
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  toggleSidebar,
  location,
}) => {

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null; 
  }

  return (
    <Layout.Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      className="sider"
    >
      <Button
        style={{
          width: collapsed ? 40 : 70,
          position: "fixed",
          top: "0",
          marginTop: "70px",
          zIndex: "1000",
          color:'white'
        }}
        type="text"
        onClick={toggleSidebar}
        icon={<MenuOutlined />}
      />
      <SideBar collapsed={collapsed} />
    </Layout.Sider>
  );
};

export default Sidebar;
