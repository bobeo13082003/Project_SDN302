import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Avatar,
  Badge,
  Dropdown,
  Menu,
  Button,
  Popconfirm,
  Pagination,
  Spin,
} from "antd";
import {
  searchQuizzes as fetchQuizzes,
  removeQuiz,
} from "../../src/services/client/ApiQuiz";
import "./exam.scss";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { countTraffic, lastesQuiz } from "../services/client/ApiQuiz";
import UpdateQuiz from "./UpdateQuiz";
const { Title, Text } = Typography;

interface Quiz {
  _id: string;
  title: string;
  description: string;
  userId: {
    userName: string;
    profilePictureUrl?: string;
    _id: string;
  };
  questions: Question[];
  termCount?: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  traffic: number;
}

interface Question {
  _id: string;
  text: string;
}

interface QuizResponse {
  data: Quiz[];
  totalPage: number;
}
interface SearchQuizProps {
  onQuizSelect: (quizId: string) => void;
  onUpdateQuiz: (quizId: string) => void;
}
const SearchQuiz: React.FC<SearchQuizProps> = (onQuizSelect, onUpdateQuiz) => {
  const { searchKey } = useParams<{ searchKey: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { t } = useTranslation("learnquiz");
  const fetchQuizzesData = async () => {
    setLoading(true);
    try {
      const response = await fetchQuizzes(currentPage, searchKey || "");
      if (response?.data) {
        const quizResponse = response.data as QuizResponse;
        setQuizzes(
          quizResponse.data.map((quiz) => ({
            ...quiz,
            termCount: quiz.questions.length,
          }))
        );
        setTotalPage(quizResponse.totalPage || 1);
      } else {
        console.error("Invalid response structure", response);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };
  // const handleDeleteQuiz = async (quizId: string) => {
  //   try {
  //     await removeQuiz(quizId);
  //     toast.success("Quiz deleted successfully!");
  //     await fetchQuizzesData();
  //   } catch (error: any) {
  //     console.error("Error deleting quiz:", error);
  //     toast.error("Failed to delete quiz. Please try again later.");
  //   }
  // };
  useEffect(() => {
    fetchQuizzesData();
  }, [currentPage, searchKey]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuizClick = (quizId: string) => {
    countTraffic(quizId);
    lastesQuiz(quizId);
    navigate(`/quiz/quiz-details/${quizId}`);
  };
  // const handleUpdateQuiz = (quizId: string) => {
  //   setSelectedQuizId(quizId);
  //   setIsUpdating(true);
  // };

  const handleBack = () => {
    setSelectedQuizId(null);
    setIsUpdating(false);
    navigate(-1);
  };
  return (
    <div className="list-quiz-container">
      {loading ? (
        <Spin tip="Loading quizzes..." size="large" />
      ) : isUpdating ? (
        <UpdateQuiz quizId={selectedQuizId!} onBack={handleBack} />
      ) : (
        <>
          <h4 style={{ marginTop: 100 }}>
            {t("ResultFor")} "{searchKey}"
          </h4>
          <Row gutter={[16, 16]} justify="center">
            {quizzes.map((quiz) => (
              <Col key={quiz._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="quiz-card"
                  onClick={() => handleQuizClick(quiz._id)}
                >
                  {/* <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item
                            key="update"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                              e.domEvent.stopPropagation();
                              handleUpdateQuiz(quiz._id);
                            }}
                          >
                            {t("UpdateQuiz")}
                          </Menu.Item>
                          <Menu.Item key="delete" icon={<DeleteOutlined />}>
                            <Popconfirm
                              title="Are you sure you want to delete this quiz?"
                              onConfirm={() => handleDeleteQuiz(quiz._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <span onClick={(e) => e.stopPropagation()}>
                                {t("DeleteQuiz")}
                              </span>
                            </Popconfirm>
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                    >
                      <Button
                        icon={<MoreOutlined />}
                        className="more-button"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown> */}

                  <Title level={5} className="quiz-title">
                    {quiz.title}
                  </Title>
                  <Badge
                    className="term-badge"
                    count={`${quiz.termCount} terms`}
                  />
                  <div className="user-info">
                    <Avatar src={quiz.userId.profilePictureUrl}>
                      {quiz.userId.userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text className="user-name">{quiz.userId.userName}</Text>
                  </div>
                  <div className="quiz-description">
                    <EyeOutlined /> {quiz.traffic}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Row justify="center" style={{ marginTop: 16 }}>
            <Col>
              <Pagination
                current={currentPage}
                total={totalPage * 10}
                onChange={handleChangePage}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default SearchQuiz;
