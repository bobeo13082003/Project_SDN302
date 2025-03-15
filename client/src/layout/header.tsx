// import logo from "../assets/QUIZZIZZ_logo_with_text-removebg-preview.png";
import { Layout, Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import ButtonAntd from "../components/Button";
import SwicthAntd from "../components/SwicthAntd";
import DropdownProfile from "../components/DropdownProfile";
import DropdownLanguage from "../components/DropdownLanguage";
import InputSearch from "../components/InputSearch";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";


const Header = () => {
  const { Header } = Layout;
  const navigate = useNavigate();
  const { t } = useTranslation('header')

  const token = useSelector((state: RootState) => state.user?.user?.token);
  const { nameApp, logo } = useSelector((state: RootState) => state.admin?.app);

  useEffect(() => {
    if (nameApp) {
      document.title = nameApp;
    }

    if (logo) {
      const iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      iconLink.href = logo;
    }
  }, [logo, nameApp]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Layout >
      <Header
        style={{
          position: "fixed",
          top: 0,
          zIndex: 999,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img onClick={() => navigate('/')} src={logo} width={50} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ flex: 1, marginLeft: "50px" }}
        />
        <InputSearch />
        <ButtonAntd  onClick={() => navigate('/flash-card')} type="primary" icon={<PlusOutlined />} style={{ margin: " 0 20px" }} />
        <DropdownLanguage />
        <SwicthAntd />
        {!token && (
          <ButtonAntd
            onClick={handleLogin}
            type="primary"
            style={{ marginLeft: "30px" }}
            content={t("login")}
          />
        )}
        {token && (
          <DropdownProfile />
        )}
      </Header>
    </Layout>
  );
};

export default Header;
