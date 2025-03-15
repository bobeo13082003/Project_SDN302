import React, { useEffect, useState } from "react";
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
} from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined,EyeOutlined  } from "@ant-design/icons";
import { removeQuiz, mostLatesQuiz } from "../../src/services/client/ApiQuiz";
import "./exam.scss";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  userId: {
    userName: string;
    _id: string;
  };
  questions: string[];
  termCount?: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  traffic: number;
}


interface ListQuizProps {
  onQuizSelect: (quizId: string) => void;
  onUpdateQuiz: (quizId: string) => void;
}

const LastesQuiz: React.FC<ListQuizProps> = ({ onQuizSelect, onUpdateQuiz }) => {
  const [latesQuiz, setLatesQuiz] = useState<Quiz[]>([]); // Most recent quizzes state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const { t } = useTranslation("learnquiz")
  // Function to fetch most recent quizzes
  const lastesQuiz = async () => {
    try {
      const response = await mostLatesQuiz(currentPage);
      if (response.data && response.data.data) {
        const quizResponse = response.data;
        const quizzesWithCount = quizResponse.data.map((quiz: Quiz) => ({
          ...quiz,
          termCount: quiz.questions.length,
        }));
        setLatesQuiz(quizzesWithCount);
        setTotalPage(quizResponse.totalPages || 1);
      } else {
        toast.error("The response doesn't contain 'data'");
      }
    } catch (error) {
      console.log(error)
    }
  };

  // Handle page change
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch most recent quizzes when the component mounts and when currentPage changes
  useEffect(() => {
    lastesQuiz();
  }, [currentPage]);

  return (
    <>
      {/* Most Recent Quizzes Section */}
      <div className="list-quiz-container">
        <Title level={4}>{t("LastQuiz")}</Title>
        <Row gutter={[16, 16]} justify="center">
          {latesQuiz &&
            latesQuiz.map((quiz) => (
              <Col key={quiz._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="quiz-card"
                  onClick={() => onQuizSelect(quiz._id)}
                >
                  {/* <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="update"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.domEvent.stopPropagation();
                          onUpdateQuiz(quiz._id);
                        }}
                      >
                       {t("UpdateQuiz")}
                      </Menu.Item>
                      <Menu.Item key="delete" icon={<DeleteOutlined />}>
                        <Popconfirm
                          title="Are you sure you want to delete this quiz?"
                          onConfirm={() => removeQuiz(quiz._id)}
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
                    count={`${quiz.termCount} thuật ngữ`}
                  />

                  <div className="user-info">
                    <Avatar alt="User Avatar">
                      {quiz.userId.userName
                        ? quiz.userId.userName.charAt(0).toUpperCase()
                        : "?"}
                    </Avatar>
                    <Text className="user-name">
                      {quiz.userId.userName || "Unknown User"}
                    </Text>
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
              onChange={handleChangePage}
              current={currentPage}
              total={totalPage * 10}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LastesQuiz;



