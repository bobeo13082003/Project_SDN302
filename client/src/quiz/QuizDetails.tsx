import React, { useEffect, useState, useMemo } from "react";
import {
  BookOutlined,
  BulbOutlined,
  SyncOutlined,
  FileTextOutlined,
  SoundOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import {
  Card,
  List,
  Typography,
  Spin,
  Button,
  Alert,
  Modal,
  Row,
  Col,
} from "antd";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import FlashCardQuestion from "./FlashCard/FlashCard";
import { Question } from "./QuestionModal";
import QuizletLearnList from "./Learn/Learn";
import MatchCard from "./MatchCard/MatchCard";
import QuizExam from "./TestQuestion/QuizExam";
import FlashCard1 from "./Plus/FlashCard/FlashCard";
import MatchCard1 from "./Plus/MatchCard/MatchCard";
import QuizExam1 from "./Plus/TestQuestion/QuizExam";
import QuizletLearnList1 from "./Plus/Learn/Learn";
import { useTranslation } from "react-i18next";
import { locales } from "../i18n/i18n";
import "./exam.scss";
import FlashCardQuestionDetail from "./FlashCardQuestionDetails/FlashCard";
import { getQuestion as GetQuestion } from "../services/client/ApiQuiz";
import { useParams, useNavigate } from "react-router-dom";
import { exportFromExcel } from "../services/client/ApiQuiz";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addLibrary } from "../services/client/ApiServies";
import { toast } from "react-toastify";
import AdsDetails from "../pages/admin/ads/AdsDetails";



const { Paragraph, Text } = Typography;

interface QuestionsByQuizIdProps {
  // quizId: string;
  quizTitle?: string;
}

const QuestionDetail: React.FC<QuestionsByQuizIdProps> = () => {
  const userId = useSelector((state: RootState) => state.user.user._id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState<
    "flashCard" | "quizletLearn" | "matchCard" | "quizExam" | null
  >(null);
  const [checkPlus, setCheckPlus] = useState(false);
  const { t, i18n } = useTranslation("learnquiz");
  const currentLanguage = locales[i18n.language as keyof typeof locales];
  const [contentKey, setContentKey] = useState<number>(0);
  const navigate = useNavigate();

  const onBack = () => {
    navigate("/home");
  };

  const transformQuestions = (dbquestions: Question[]): Question[] => {
    return dbquestions.map((question, questionIndex) => {
      let options: string[] = [];

      if (question.type === "TF") {
        options = ["True", "False"];
      } else {
        options = [
          question.correctAnswer,
          ...dbquestions
            .filter((q, qIndex) => qIndex !== questionIndex)
            .map((q) => q.correctAnswer)
            .filter((answer) => answer)
            .sort(() => Math.random() - 0.5),
        ];

        if (dbquestions.length < 4) {
          options = options
            .slice(0, 2)
            .concat(["", ""])
            .sort(() => Math.random() - 0.5);
        } else {
          options = options.slice(0, 4);
          while (options.length < 4) options.push("");
          options = options.sort(() => Math.random() - 0.5);
        }
      }

      return {
        ...question,
        answerA: options[0] || "",
        answerB: options[1] || "",
        answerC: options[2] || "",
        answerD: options[3] || "",
      };
    });
  };

  const originalQuestions = useMemo(
    () => transformQuestions(questions),
    [questions]
  );
  const { quizId } = useParams<string>();
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await GetQuestion(quizId);
      const fetchedQuestions = response.data;
      setQuestions(fetchedQuestions);

      const isPlus =
        fetchedQuestions.length > 0 && fetchedQuestions[0].answerA !== "";
      setCheckPlus(isPlus);
    } catch {
      setError(
        `Failed to fetch questions for quiz ID: ${quizId}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async () => {
    try {
      const response = await exportFromExcel(quizId);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "quiz_questions.xlsx"); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      setError("Failed to export questions to Excel.");
    }
  };

  const handleAddLibrary = async () => {
    try {
      const res = await addLibrary(userId, quizId);
      if (res.data && res.data.code === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setActiveComponent(null);
  };


  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    if (currentLanguage === "English") {
      utterance.voice =
        voices.find(
          (voice) => voice.lang === "en-US" && voice.name.includes("Female")
        ) ||
        voices.find((voice) => voice.lang === "en-US") ||
        null;
    } else if (currentLanguage === "Tiếng Việt") {
      utterance.voice =
        voices.find(
          (voice) => voice.lang === "vi-VN" && voice.name.includes("Female")
        ) ||
        voices.find((voice) => voice.lang === "vi-VN") ||
        null;
    }

    utterance.rate = 0.45;
    speechSynthesis.speak(utterance);
  };

  const token = useSelector((state: RootState) => state.user?.user?.token);

  const showModal = (component: any) => {
    setActiveComponent(component);
    setIsModalVisible(true);
    setContentKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert
            message={error}
            type="error"
            showIcon
            action={<Button onClick={onBack}>{t("BackToQuizList")}</Button>}
          />
        ) : (
          <div className="row" style={{ marginTop: 100 }}>

            <div className="col-9 text-center">
              <div className="button-quiz">
                <Button
                  icon={<BookOutlined />}
                  onClick={() => showModal("flashCard")}
                >
                  {t("FlashCard")}
                </Button>
                <Button
                  icon={<BulbOutlined />}
                  onClick={() => showModal("quizletLearn")}
                >
                  {t("Learn")}
                </Button>
                <Button
                  icon={<SyncOutlined />}
                  onClick={() => showModal("matchCard")}
                >
                  {t("MatchCard")}
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => showModal("quizExam")}
                >
                  {t("Test")}
                </Button>
              </div>

              <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                maskClosable={false}
                footer={null}
                className="modal-container"
                width="80%"
              >
                <div key={contentKey}>
                  {activeComponent === "flashCard" &&
                    (checkPlus ? (
                      <FlashCard1 questions={questions} />
                    ) : (
                      <FlashCardQuestion questions={originalQuestions} />
                    ))}
                  {activeComponent === "quizletLearn" &&
                    (checkPlus ? (
                      <QuizletLearnList1 questions={questions} />
                    ) : (
                      <QuizletLearnList questions={originalQuestions} />
                    ))}
                  {activeComponent === "matchCard" &&
                    (checkPlus ? (
                      <MatchCard1 questions={questions} />
                    ) : (
                      <MatchCard questions={questions} />
                    ))}
                  {activeComponent === "quizExam" &&
                    (checkPlus ? (
                      <QuizExam1 questions={questions} />
                    ) : (
                      <QuizExam questions={originalQuestions} />
                    ))}
                </div>
              </Modal>

              <div className="">
                <FlashCardQuestionDetail questions={questions} />
              </div>
            </div>
            <div className="col-3">
              <AdsDetails />
            </div>
          </div>
        )}
        <div className="text-center row">
          <div className="col-9">

            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 16 }}
            >
              {/* Back Button */}
              <Col>
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                >
                  {t("BackToQuizList")}
                </Button>
              </Col>

              <Col>
                <Button className="mx-2" onClick={handleAddLibrary}>
                  <FolderOpenOutlined /> {t("Add Library")}
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                >
                  {t("Export")}
                </Button>
              </Col>
            </Row>
          </div>
        </div>

        <div className="row" style={{ padding: "20px" }}>
          <div className="col-9">
            {questions.length === 0 ? (
              <Paragraph>No questions available for this quiz.</Paragraph>
            ) : (
              <List
                itemLayout="vertical"
                size="large"
                dataSource={questions}
                renderItem={(question) => (
                  <List.Item key={question._id}>
                    <Card
                      title={question.questionText}
                      style={{ marginBottom: "20px" }}
                      extra={
                        <Button
                          icon={<SoundOutlined style={{ fontSize: "20px" }} />}
                          onClick={() => {
                            if (currentLanguage === "English") {
                              if (!token) {
                                speakText("Please login to listen ");
                              } else {
                                speakText(`Question: ${question.questionText}.`);
                                if (question.answerA !== "")
                                  speakText(`Answer A: ${question.answerA}`);
                                if (question.answerB !== "")
                                  speakText(`Answer B: ${question.answerB}`);
                                if (question.answerC !== "")
                                  speakText(`Answer C: ${question.answerC}`);
                                if (question.answerD !== "")
                                  speakText(`Answer D: ${question.answerD}`);

                                speakText(
                                  `Correct Answer: ${question.correctAnswer}`
                                );
                              }
                            } else if (currentLanguage === "Tiếng Việt") {
                              if (!token) {
                                speakText("Đăng nhập để nghe ");
                              } else {
                                speakText(`Câu hỏi: ${question.questionText}.`);
                                if (question.answerA !== "")
                                  speakText(`Đáp án A: ${question.answerA}`);
                                if (question.answerB !== "")
                                  speakText(`Đáp án B: ${question.answerB}`);
                                if (question.answerC !== "")
                                  speakText(`Đáp án C: ${question.answerC}`);
                                if (question.answerD !== "")
                                  speakText(`Đáp án D: ${question.answerD}`);

                                speakText(
                                  `Đáp án đúng: ${question.correctAnswer}`
                                );
                              }
                            }
                          }}
                        ></Button>
                      }
                    >
                      {question.image && (
                        <img
                          src={question.image}
                          alt="Question Image"
                          style={{ width: "100%", marginBottom: "10px" }}
                        />
                      )}

                      <Paragraph>
                        {((question.answerA !== "" && question.type !== "TF") ||
                          (question.type === "TF" &&
                            (question.answerA ?? "").trim() === "True")) && (
                            <>
                              <Text strong>{t("AnswerA")} </Text> {question.answerA}{" "}
                            </>
                          )}
                      </Paragraph>
                      <Paragraph>
                        {((question.answerB !== "" && question.type !== "TF") ||
                          (question.type === "TF" &&
                            (question.answerB ?? "").trim() === "False")) && (
                            <>
                              <Text strong>{t("AnswerB")}</Text> {question.answerB}{" "}
                            </>
                          )}
                      </Paragraph>
                      <Paragraph>
                        {question.answerC !== "" && question.type !== "TF" && (
                          <>
                            <Text strong>{t("AnswerC")}</Text> {question.answerC}{" "}
                          </>
                        )}
                      </Paragraph>
                      <Paragraph>
                        {question.answerD !== "" && question.type !== "TF" && (
                          <>
                            <Text strong>{t("AnswerD")}</Text> {question.answerD}
                          </>
                        )}
                      </Paragraph>

                      <Paragraph>
                        {question.answerA === "" && question.type !== "TF" && (
                          <Text strong>{t("Define")}:</Text>
                        )}
                        {(question.answerA !== "" || question.type === "TF") && (
                          <Text strong>{t("CorrectAnswer")}</Text>
                        )}
                        <div
                          style={{
                            filter: token ? "none" : "blur(5px)",
                            cursor: token ? "default" : "not-allowed",
                            color: token ? "inherit" : "gray",
                          }}
                          title={token ? "" : "Login to view the answer"}
                        >
                          {question.correctAnswer.split(`/"'\\`).join(`,`)}
                        </div>
                      </Paragraph>
                      <Paragraph>
                        <Text strong>{t("AnswerType")}</Text> {question.type}
                      </Paragraph>
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionDetail;

