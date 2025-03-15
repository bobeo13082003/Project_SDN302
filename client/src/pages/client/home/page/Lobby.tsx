import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Input, Layout, Menu, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { userProfile } from "../../../../services/client/ApiServies";
import { doLogout } from "../../../../store/reducer/userReducer";
import Home from "./index";
import Footer from "../../../../layout/footer";
import Logo from "../../../../assets/QUIZZIZZ_logo_with_text-removebg-preview.png"

interface Profile {
  email: string;
  userName: string;
}

interface LobbyProps {
  onLogin: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ onLogin }) => {
  const { Header } = Layout;
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user?.user?.token);
  const [profile, setProfile] = useState<Profile>();
  const dispatch = useDispatch();

  const handleLogin = () => {
    navigate("/login");
    onLogin();
  };

  const getProfile = async () => {
    try {
      const res = await userProfile();
      if (res.data && res.data.code === 401) {
        navigate("/login");
      } else {
        if (res.data && res.data?.code === 200) {
          setProfile(res.data.user);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
    dispatch(doLogout());
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const items = [
    {
      label: "Profile",
      key: "1",
      onClick: handleProfile,
      style: {
        width: 300,
        fontSize: 18,
        fontWeight: 700,
      },
    },
    {
      label: "Logout",
      key: "2",
      onClick: handleLogout,
      style: {
        width: 300,
        fontSize: 18,
        fontWeight: 700,
      },
    },
  ];

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={Logo}
            width={50}
            alt="Logo"
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ flex: 1, marginLeft: "50px" }}
          />
          <Input
            placeholder="Search for practice test"
            style={{ width: "300px", textAlign: "center" }}
            prefix={<SearchOutlined />}
          />
          {!token && (
            <Button
              onClick={handleLogin}
              type="primary"
              style={{ marginLeft: "30px" }}
            >
              Log in
            </Button>
          )}
          {token && (
            <Dropdown className="ms-2" menu={{ items }}>
              <Space>
                <Avatar style={{ backgroundColor: "orange", color: "white" }}>
                  {profile?.userName.charAt(0).toUpperCase()}
                </Avatar>
              </Space>
            </Dropdown>
          )}
        </Header>
        <Layout.Content style={{ padding: "20px", textAlign: "center" }}>
          <Home />
        </Layout.Content>
      </Layout>
      <Footer />
    </div>
  );
};

export default Lobby;
