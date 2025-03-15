// AdminLayout.tsx
import React, { useEffect } from "react";
import { Button, Layout, Menu } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  DashboardOutlined,
  LikeOutlined,
  LogoutOutlined,
  BugOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { adminDoLogout, adminEditApp } from "../../../store/reducer/adminReducer";
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from "../../../store/store";
import { generalSetting } from "../../../services/admin/generalSettingServices";

const { Sider, Content } = Layout;


const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleMenuClick = (key: string) => {
    navigate(key);
  };
  const logoApp = useSelector((state: RootState) => state.admin?.app?.logo);


  const handleLogout = () => {
    dispatch(adminDoLogout());
    navigate('/admin/login')
  }
  const getDataApp = async () => {
    try {
      const res = await generalSetting();
      if (res.data && res.data.code === 200) {
        dispatch(adminEditApp({ email: res.data.data.email, nameApp: res.data.data.nameApp, logo: res.data.data.image }))
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDataApp();
  }, [])

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar with new color and padding style */}
        <Sider
          theme="dark"
          width={240}
          style={{
            background: "#001529",
            height: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          <div style={{ padding: "16px", color: "#fff", textAlign: "center" }}>
            <img onClick={() => navigate("/admin")} src={logoApp} width={50} />
          </div>
          <Menu
            mode="inline"
            theme="dark"
            onClick={({ key }) => handleMenuClick(key)}
            items={[
              {
                label: "Dashboard",
                key: "/admin",
                icon: <DashboardOutlined />,
              },
              {
                label: "Users Management",
                key: "/admin/user-manage",
                icon: <UserOutlined />,
              },
              {
                label: "Quiz Management",
                key: "/admin/quiz-manage",
                icon: <FileTextOutlined />,
              },
              {
                label: "Blogs Management",
                key: "/admin/blog-manage",
                icon: <LikeOutlined />,
              },
              {
                label: "Comments",
                key: "/admin/comment-manage",
                icon: <LikeOutlined />,
              },
              {
                label: "General Setting",
                key: "/admin/general-setting",
                icon: <SettingOutlined />,
              },
              {
                label: "Ads Management",
                key: "/admin/ads-manage",
                icon: <BugOutlined />,
              },
            ]}
            style={{ fontSize: "16px", fontWeight: "500" }}
          />
          <Button
            onClick={handleLogout}
            type="primary"
            icon={<LogoutOutlined />}
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              borderRadius: "4px",
            }}
          >
            Logout
          </Button>
        </Sider>

        <Layout>
          <Content
            style={{
              padding: "24px 48px",
              minHeight: "calc(100vh - 64px)",
              background: "#f0f2f5",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default AdminLayout;
