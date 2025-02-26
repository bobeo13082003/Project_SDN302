import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  BulbOutlined,
  SyncOutlined,
  FileTextOutlined,
  SoundOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Card, List, Typography, Spin, Button, Alert, Modal } from "antd";
import FlashCardQuestion from "./FlashCard/FlashCard";
import { Question } from "./QuestionModal";
import QuizletLearnList from "./Learn/Learn";
import MatchCard from "./MatchCard/MatchCard";
import QuizExam from "./TestQuestion/QuizExam";
import "./exam.scss";
import { getQuestionByQuizID } from "../services/client/ApiQuiz";
import { addLibrary } from "../services/client/ApiServies";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FlashCard1 from "./Plus/FlashCard/FlashCard";
import MatchCard1 from "./Plus/MatchCard/MatchCard";
import QuizExam1 from "./Plus/TestQuestion/QuizExam";
import QuizletLearnList1 from "./Plus/Learn/Learn";
import { useTranslation } from "react-i18next";
import { locales } from "../i18n/i18n";
import "./exam.scss";
import FlashCardQuestionDetail from "./FlashCardQuestionDetails/FlashCard"
import { getQuestion as GetQuestion } from "../services/client/ApiQuiz"


const { Paragraph, Text } = Typography;

interface QuestionsByQuizIdProps {
  quizId: string;
  quizTitle?: string;
  onBack: () => void;
}

const QuestionsByQuizId: React.FC<QuestionsByQuizIdProps> = ({
  quizId,
  onBack,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [contentKey, setContentKey] = useState<number>(0);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [checkPlus, setCheckPlus] = useState(false);
  const { t } = useTranslation("learnquiz");
  const showModal = (component: any) => {
    setActiveComponent(component);
    setIsModalVisible(true);
  };
  const transformQuestions = (dbquestions: Question[]): Question[] => {
    return dbquestions.map((question, questionIndex) => {
      let options: string[] = [];

      if (question.type === "TF") {
        // Gắn các đáp án cố định cho câu hỏi "True/False"
        options = ["True", "False"];
      } else {
        // Lấy correctAnswer từ các câu hỏi khác để tạo danh sách đáp án
        options = [
          question.correctAnswer,
          ...dbquestions
            .filter((q, qIndex) => qIndex !== questionIndex) // Exclude current question
            .map((q) => q.correctAnswer)
            .filter((answer) => answer) // Filter out invalid answers (undefined/null)
            .sort(() => Math.random() - 0.5), // Shuffle randomly
        ];

        // If dbquestions has fewer than 4 questions
        if (dbquestions.length < 4) {
          // Slice options to ensure we only have 2 answers and add empty strings
          options = options.slice(0, 2);
          options.push("", ""); // Add empty values for missing options
          // Shuffle the options randomly
          options = options.sort(() => Math.random() - 0.5);
        } else {
          // Ensure a maximum of 4 options
          options = options.slice(0, 4);
          // Add empty answers if there are fewer than 4 options
          while (options.length < 4) {
            options.push("");
          }
          // Shuffle the options randomly
          options = options.sort(() => Math.random() - 0.5);
        }

      }

      return {
        _id: question._id,
        quizID: question.quizID,
        questionText: question.questionText || "",
        image: question.image,
        answerA: options[0] || "",
        answerB: options[1] || "",
        answerC: options[2] || "",
        answerD: options[3] || "",
        correctAnswer: question.correctAnswer.trim() || "",
        type: question.type,
      };
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setActiveComponent(null);
    setContentKey(prevKey => prevKey + 1);
  };
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestionByQuizID(quizId);
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
      setError("Failed to fetch questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchQuestions();
  }, [quizId]);


  const { i18n } = useTranslation();
  const currentLanguage = locales[i18n.language as keyof typeof locales];
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    if (currentLanguage === "English") {
      utterance.voice =
        voices.find((voice) => voice.lang === "en-US" && voice.name.includes("Female")) ||
        voices.find((voice) => voice.lang === "en-US") || null;
    } else if (currentLanguage === "Tiếng Việt") {
      utterance.voice =
        voices.find((voice) => voice.lang === "vi-VN" && voice.name.includes("Female")) ||
        voices.find((voice) => voice.lang === "vi-VN") || null;
    }

    utterance.rate = 0.45;
    speechSynthesis.speak(utterance);
  };
  const fetchOrginalQuestions = () => {
    const transformedQuestions = transformQuestions(questions);
    setOriginalQuestions(transformedQuestions);
  }
  const fetchTypeQuiz = () => {
    if (questions.length > 0) {
      if (questions[0].answerA === "") {
        setCheckPlus(false);
      } else {
        setCheckPlus(true);
      }
    } else {
      setCheckPlus(false);
    }
  }
  useEffect(() => {
    fetchQuestions();

  }, [quizId]);
  useEffect(() => {
    fetchTypeQuiz();
  })
  useEffect(() => {
    fetchOrginalQuestions();
  })
  const handleRetry = () => {
    setError(null);
    fetchQuestions();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        <Paragraph>{error}</Paragraph>
        <Button onClick={handleRetry} type="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert
            message={error}
            type="error"
            showIcon
            action={<Button onClick={onBack}>Back to Quiz List</Button>}
          />
        ) : (
          <div style={{ zIndex: 1000 }}>
            <div className="center-container">
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
                  {activeComponent === "flashCard" && (
                    checkPlus ? (
                      <FlashCard1 questions={questions} />

                    ) : (
                      <FlashCardQuestion questions={originalQuestions} />
                    )
                  )}
                  {activeComponent === "quizletLearn" && (
                    checkPlus ? (
                      <QuizletLearnList1 questions={questions} />
                    ) : (
                      <QuizletLearnList questions={originalQuestions} />

                    )
                  )}
                  {activeComponent === "matchCard" && (
                    checkPlus ? (
                      <MatchCard1 questions={questions} />
                    ) : (
                      <MatchCard questions={questions} />


                    )
                  )}
                  {activeComponent === "quizExam" && (
                    checkPlus ? (
                      <QuizExam1 questions={questions} />
                    ) : (
                      <QuizExam questions={originalQuestions} />

                    )
                  )}
                </div>
              </Modal>

              <div className="">
                <FlashCardQuestionDetail questions={questions} />
              </div>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <Button onClick={onBack}>
            Back to Quiz List
          </Button>

        </div>
        <Button onClick={onBack}>{t("BackToQuizList")}</Button>
      </div>

      <div style={{ padding: "20px" }}>
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
                          speakText(`${question.questionText}.`);
                          speakText(`Answer A: ${question.answerA}`);
                          speakText(`Answer B: ${question.answerB}`);
                          speakText(`Answer C: ${question.answerC}`);
                          speakText(`Answer D: ${question.answerD}`);
                          speakText(`Correct Answer: ${question.correctAnswer}`);
                        } else if (currentLanguage === "Tiếng Việt") {
                          speakText(`${question.questionText}.`);
                          speakText(`Đáp án A: ${question.answerA}`);
                          speakText(`Đáp án B: ${question.answerB}`);
                          speakText(`Đáp án C: ${question.answerC}`);
                          speakText(`Đáp án D: ${question.answerD}`);
                          speakText(`Đáp án đúng: ${question.correctAnswer}`);
                        }
                      }}
                    >
                    </Button>
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
                    {((question.answerA !== "" && question.type !== "TF") || (question.type === "TF" && question.answerA.trim() === "True")) && (<>
                      <Text strong>{t("AnswerA")} </Text> {question.answerA} </>)}
                  </Paragraph>
                  <Paragraph>
                    {((question.answerB !== "" && question.type !== "TF") || (question.type === "TF" && question.answerB.trim() === "False")) && (

                      <>
                        <Text strong>{t("AnswerB")}</Text> {question.answerB} </>)}
                  </Paragraph>
                  <Paragraph>
                    {question.answerC !== "" && question.type !== "TF" && (<>


                      <Text strong>{t("AnswerC")}</Text> {question.answerC} </>)}
                  </Paragraph>
                  <Paragraph>
                    {question.answerD !== "" && question.type !== "TF" && (<>


                      <Text strong>{t("AnswerD")}</Text> {question.answerD}</>)}
                  </Paragraph>

                  <Paragraph>
                    {question.answerA === "" && question.type !== "TF" && (
                      <Text strong>{t("Define")}:</Text>
                    )}
                    {(question.answerA !== "" || question.type === "TF") && (
                      <Text strong>{t("CorrectAnswer")}</Text>
                    )}
                    {question.correctAnswer.split(`/"'\\`).join(`,`)}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>{t("AnswerType")}:</Text> {question.type}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default QuestionsByQuizId;