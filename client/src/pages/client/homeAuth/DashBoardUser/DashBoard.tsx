import React, { useEffect, useState } from "react";
import { Card, Space, Statistic, Typography, Spin } from "antd";
import {
  AppstoreOutlined,
  FileOutlined,
  TwitchOutlined,
  CheckCircleOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import {
  getQuiz,
  getLikedBlogCount,
  getQuestionByQuizID,
} from "../../../../services/client/ApiServies";
import "./dashboard.scss";
import MyCalendar from "./Calendar";
import QuizDataFetcher from "./QuizDataFetcher";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import AdsDetails from "../../../admin/ads/AdsDetails";

type DashBoardCardProps = {
  title: string;
  value: number | null;
  icon: React.ReactNode;
  iconClassName: string;
  loading: boolean;
};

const DashBoard = () => {
  const [quizCount, setQuizCount] = useState<number | null>(null);
  const [quizLoading, setQuizLoading] = useState<boolean>(true);
  const [likedBlogCount, setLikedBlogCount] = useState<number | null>(null);
  const [blogLoading, setBlogLoading] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<number | null>(null); 
  const [typeNCount, setTypeNCount] = useState<number | null>(null); 
  const [typeTFCount, setTypeTFCount] = useState<number | null>(null); 

  const currentUserId = useSelector((state: RootState) => state.user.user._id);

  useEffect(() => {
    const fetchQuizData = async () => {
      setQuizLoading(true);
      try {
        
        const response = await getQuiz();
        const userQuizzes = response.data.filter(
          (quiz: any) => quiz.userId?._id === currentUserId
        );

        let totalQuestions = 0;
        let typeNCount = 0;
        let typeTFCount = 0;

        for (const quiz of userQuizzes) {
          const questionResponse = await getQuestionByQuizID(quiz._id);
          const questions = questionResponse.data;

          totalQuestions += questions.length;

          
          typeNCount += questions.filter((q: any) => q.type === "N").length;
          typeTFCount += questions.filter((q: any) => q.type === "TF").length;
        }

        setQuizCount(userQuizzes.length); 
        setQuestionCount(totalQuestions); 
        setTypeNCount(typeNCount);
        setTypeTFCount(typeTFCount); 
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        setQuizCount(0);
        setQuestionCount(0);
        setTypeNCount(0);
        setTypeTFCount(0);
      } finally {
        setQuizLoading(false);
      }
    };

    const fetchLikedBlogData = async () => {
      setBlogLoading(true);
      try {
        const likedBlogs = await getLikedBlogCount(currentUserId);
        setLikedBlogCount(likedBlogs);
      } catch (error) {
        console.error("Failed to fetch liked blogs:", error);
        setLikedBlogCount(0);
      } finally {
        setBlogLoading(false);
      }
    };

    fetchQuizData();
    fetchLikedBlogData();
  }, [currentUserId]);

  const cardData: DashBoardCardProps[] = [
    {
      icon: <QuestionOutlined />,
      iconClassName: "dashboard-icon-quiz",
      title: "Total Questions",
      value: questionCount,
      loading: quizLoading,
    },
    {
      icon: <AppstoreOutlined />,
      iconClassName: "dashboard-icon-typeN",
      title: "Type N Questions",
      value: typeNCount,
      loading: quizLoading,
    },
    {
      icon: <CheckCircleOutlined />,
      iconClassName: "dashboard-icon-typeTF",
      title: "Type TF Questions",
      value: typeTFCount,
      loading: quizLoading,
    },
    {
      icon: <TwitchOutlined />,
      iconClassName: "dashboard-icon-blog",
      title: "Liked Blogs",
      value: likedBlogCount,
      loading: blogLoading,
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <div>
        <AdsDetails />
      </div>

      <div className="row justify-content-center g-4">
        {cardData.map((card, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <DashBoardCard
              icon={card.icon}
              iconClassName={card.iconClassName}
              title={card.title}
              value={card.value}
              loading={card.loading}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "100px" }}>
        <Typography.Title
          level={4}
          style={{
            textAlign: "center",
            color: "#FF5722",
            padding: "50px",
          }}
        >
          Total Quiz : {quizCount ?? 0} {""} <FileOutlined />
        </Typography.Title>
        <h4 style={{ paddingLeft: "20px", color: "red" }}>Quiz Statistics</h4>
        <QuizDataFetcher currentUserId={currentUserId} />
      </div>
    </div>
  );
};

function DashBoardCard({
  title,
  value,
  icon,
  iconClassName,
  loading,
}: DashBoardCardProps) {
  return (
    <Card className="dashboard-card">
      <Space>
        <div className={`dashboard-icon ${iconClassName}`}>{icon}</div>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Statistic
            className="dashboard-statistic"
            title={title}
            value={value ?? 0}
          />
        )}
      </Space>
    </Card>
  );
}

export default DashBoard;
