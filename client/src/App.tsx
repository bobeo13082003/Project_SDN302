// App.tsx
import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./layout/header";
import Footer from "./layout/footer";
import Sidebar from "./layout/sidebar";
import Lobby from "./pages/client/home/page/Lobby";
import "./App.scss";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoApp from './assets/QUIZZIZZ_logo_with_text-removebg-preview.png'

const App: React.FC = () => {
  const app = useSelector((state: RootState) => state.admin.app);
  const logo = app.logo || logoApp;
  const nameApp = app.nameApp || "Quiz";
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const token = useSelector((state: RootState) => state.user?.user?.token);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    const newLoginState = !isLoggedIn;
    setIsLoggedIn(newLoginState);
    localStorage.setItem("isLoggedIn", String(newLoginState));
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const newCollapsedState = !prev;
      localStorage.setItem("sidebarCollapsed", String(newCollapsedState));
      return newCollapsedState;
    });
  };

  useEffect(() => {
    // Cập nhật title
    if (nameApp) {
      document.title = nameApp;
    }

    const iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (logo && iconLink) {
      iconLink.href = logo;
    }
  }, [logo, nameApp]);

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Lobby onLogin={handleLogin} />
      ) : (
        <>
          <div className="header-container">
            <Header />
          </div>

          <div className="app-content">
            <Layout className="app-body">

              {token && (
                <Sidebar
                  collapsed={collapsed}
                  toggleSidebar={toggleSidebar}
                  location={location}
                />
              )}

              <Layout className="inner-body select-mode">
                <Outlet />
              </Layout>

            </Layout>
          </div>

          <div className="app-footer">
            <Footer />
          </div>
        </>
      )}
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
    </div>
  );
};

export default App;
