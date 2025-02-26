import React from "react";
import DashBoard from "./DashBoardUser/DashBoard";
import "./slider.scss";
import { useTranslation } from "react-i18next";
import { Tabs, TabsProps } from "antd";
import UserLibrary from "../userLibrary/UserLibrary";

import UserQuiz from "../../../quiz/UserQuiz";
const Library = () => {
  const { t } = useTranslation("sider");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("dashboard"),
      children: <DashBoard />,
    },
    {
      key: "2",
      label: t("library"),
      children: <UserLibrary />,
    },

    {
      key: "3",
      label: ("Your Quizzes"),
      children: <UserQuiz />,
    },
  ];

  return (
    <div className="lib-nav" style={{ margin: 50 }}>
      <h1 style={{ paddingTop: "50px" }}>{t("library")}</h1>
      <div className="select-mode">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default Library;