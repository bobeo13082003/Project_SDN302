import React, { useEffect, useState } from "react";
import { Badge, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  FolderOpenOutlined,
  BellOutlined,
  FileTextOutlined,
  FileOutlined,
} from "@ant-design/icons";
import "./slider.scss";
import { useTranslation } from "react-i18next";
import ModalNotification from "../../../components/ModalNotification";
import { getNotification } from "../../../services/client/ApiServies";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { doLike } from "../../../store/reducer/userReducer";

interface SideBarProps {
  collapsed: boolean;
}

export interface Notification {
  _id: string,
  userId: string,
  message: string,
  isRead: boolean,
  createAt: string
}

const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {
  const { t } = useTranslation("sider");
  const location = useLocation();
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notification, setNotification] = useState<Notification[]>([]);
  // const [numberNotification, setNumberNotification] = useState<number>(0)

  // const dispatch = useDispatch();
  const handleShowNotification = () => {
    setShowNotification(true);
  }
  let numberNoti = useSelector((state: RootState) => state.user.notification)

  const getDataNotification = async () => {
    try {
      const res = await getNotification();
      if (res.data && res.data.code === 200) {
        setNotification(res.data.data)
        const unreadNotifications = res.data.data.filter(
          (notif: Notification) => !notif.isRead
        );
        numberNoti = unreadNotifications.length

      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getDataNotification();
  }, [numberNoti])


  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: t("home"), path: "/home" },
    {
      key: "2",
      icon: <FolderOpenOutlined />,
      label: t("your library"),
      path: "/library",
    },
    {
      key: "3",
      icon: (
        <Badge className="me-2" size="small" showZero count={notification.length < 1 ? 0 : numberNoti}>
          <BellOutlined onClick={handleShowNotification} />
        </Badge>
      ),
      label: t("notifications"),
      path: null
    },
    {
      key: "4",
      icon: collapsed ? <span /> : null,
      label: collapsed ? null : t("start here"),
      path: null,
    },
    {
      key: "5",
      icon: <FileTextOutlined />,
      label: t("flashcards"),
      path: "/flash-card",
    },
    {
      key: "6",
      icon: <FileOutlined />,
      label: t("expert solutions"),
      path: "/explanations",
    },
  ];

  const selectedKey = menuItems
    .filter((item) => location.pathname === item.path)
    .map((item) => item.key);

  return (
    <div style={{ width: collapsed ? 80 : 200 }}>
      <Menu
        className={collapsed ? "collapsed-menu" : ""}
        theme="light"
        inlineCollapsed={collapsed}
        style={{
          width: collapsed ? 80 : 200,
          position: "fixed",
          top: "0",
          marginTop: "100px",
          zIndex: "999",
          backgroundColor: "#0b0b2b",
          height: "100vh",
        }}
        selectedKeys={selectedKey} 
      >
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
            <Menu.Item onClick={item.key === "3" ? handleShowNotification : undefined} icon={item.icon} style={{ color: "white" }}>
              {item.path ? (
                <Link to={item.path} style={{ color: "white" }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: "white" }}>{item.label}</span>
              )}
            </Menu.Item>
          </React.Fragment>
        ))}
      </Menu>
      <ModalNotification getDataNotification={getDataNotification} notification={notification} showNotification={showNotification} setShowNotification={setShowNotification} />
    </div>
  );
};

export default SideBar;
