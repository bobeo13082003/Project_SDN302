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
import { MoreOutlined, EditOutlined, DeleteOutlined ,EyeOutlined} from "@ant-design/icons";
import { removeQuiz, mostRecentQuiz } from "../../src/services/client/ApiQuiz";
import "./exam.scss";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
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

interface ListQuizProps {
    onQuizSelect: (quizId: string) => void;
    onUpdateQuiz: (quizId: string) => void;
}

const LastesQuiz: React.FC<ListQuizProps> = ({ onQuizSelect, onUpdateQuiz }) => {
    const [mostTrafficQuizzes, setMostTrafficQuizzes] = useState<Quiz[]>([]); // Most traffic quizzes state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
const{t}=useTranslation("learnquiz")
    const mostTraffic = async () => {
        try {
            const response = await mostRecentQuiz(currentPage);
            // Check if response.data exists and if data is an array
            if (response && response.data && Array.isArray(response.data.data)) {
                const quizResponse = response.data as QuizResponse;

                // Map the data array inside response.data
                const quizzesWithCount = quizResponse.data.map((quiz: Quiz) => ({
                    ...quiz,
                    termCount: quiz.questions.length,
                }));

                setMostTrafficQuizzes(quizzesWithCount);
                setTotalPage(quizResponse.totalPage || 1);
            } else {
                // Handle the case where response.data.data is not an array
                toast.error("quizResponse.data.data is not an array or doesn't exist");
                console.error("quizResponse.data.data is not an array", response.data);
            }
        } catch (error) {
            console.error("Failed to fetch most recent quizzes", error);
            toast.error("Failed to fetch most recent quizzes: " + error.message);
        }
    };


    // Handle page change
    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };

    // Fetch most trafficked quizzes when the component mounts and when currentPage changes
    useEffect(() => {
        mostTraffic();
    }, [currentPage]);

    return (
      <>
        {/* Most Traffic Quizzes Section */}
        <div className="list-quiz-container">
          <Title level={4}>{t("MostQuiz")}</Title>
          <Row gutter={[16, 16]} justify="center">
            {mostTrafficQuizzes.map((quiz) => (
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
                                                       {t("UpdateQuiz")}
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
                    <Avatar
                      src={quiz.userId.profilePictureUrl}
                      alt="User Avatar"
                    >
                      {quiz.userId.userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text className="user-name">{quiz.userId.userName}</Text>
                  </div>
                  <div className="user-description">
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
                total={totalPage * 2}
              />
            </Col>
          </Row>
        </div>
      </>
    );
};

export default LastesQuiz;