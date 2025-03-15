import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLogout } from "../store/reducer/userReducer";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { userProfile } from "../services/client/ApiServies";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import React from "react";
interface Profile {
    email: string;
    userName: string;
}
const DropdownProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile>();
    const { t } = useTranslation('header')

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

    const handleLogout = async () => {
        dispatch(doLogout());
        navigate('/')
    };

    const handleProfile = () => {
        navigate("/profile");
    };
    const items: MenuProps["items"] = [
        {
            label: t('profile'),
            key: "1",
            style: {
                width: 300,
                fontSize: 18,
                fontWeight: 700,
            },
            onClick: handleProfile,
        },
        {
            label: t('logout'),
            key: "2",
            onClick: handleLogout,
            style: {
                width: 300,
                fontSize: 18,
                fontWeight: 700,
            },
        },
    ];

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <Dropdown className="ms-2" menu={{ items }}>
                <Space>
                    <Avatar style={{ backgroundColor: "orange", color: "white" }}>
                        {profile?.userName?.charAt(0).toUpperCase()}
                    </Avatar>
                </Space>
            </Dropdown>
        </>
    );
};

export default DropdownProfile;