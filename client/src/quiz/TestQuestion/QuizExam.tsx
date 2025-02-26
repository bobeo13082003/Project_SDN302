import React, { useState } from "react";
import {
  Card,
  List,
  Button,
  Typography,
  Alert,
  Modal,
  Input,
  Radio,
} from "antd";
import "./examQuiz.scss";
import { useEffect, useMemo } from "react";
import { Question } from "../QuestionModal";
import {useTranslation} from "react-i18next";
const { Title } = Typography;
//Kiểu của questioninterface
interface QuizletLearnListProps {
  questions: Question[];
}

// dữ liệu sẽ được đảo ngược lại , câu hỏi thành câu trả lời và đáp án thành câu hỏi

const createMatchTypeQuestions = (
  originalQuestions: Question[],
  reversedQuestions: Question[]
): Question[] => {
  return originalQuestions.map((original, originalIndex) => {
    const matchingReversed = reversedQuestions.find(
      (reversed, reversedIndex) => reversedIndex === originalIndex
    );

    if (Math.random() > 0.5) {
      return {
        quizID: original.quizID,
        questionText: original.questionText || "",
        image: original.image,
        answerA: original.answerA,
        answerB: original.answerB,
        answerC: original.answerC,
        answerD: original.answerD,
        correctAnswer: original.correctAnswer || "",
        type: original.type,
      };
    } else {
      return {
        quizID: original.quizID,
        questionText: matchingReversed?.questionText || "",
        image: matchingReversed?.image || "",
        answerA: matchingReversed?.answerA || "",
        answerB: matchingReversed?.answerB || "",
        answerC: matchingReversed?.answerC || "",
        answerD: matchingReversed?.answerD || "",
        correctAnswer: original.questionText || "",
        type: original.type,
      };
    }
  });
};

const QuizExam1: React.FC<QuizletLearnListProps> = ({
  questions: originalQuestions,
}) => {
  const { t } = useTranslation("learnquiz");
  const [questions, setQuestions] = useState<Question[]>(originalQuestions);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [answerMode, setAnswerMode] = useState<
    "select" | "text" | "random" | null
  >(null);
  const [questionCount, setQuestionCount] = useState(
    Math.ceil(questions.length / 2)
  );
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    setFilteredQuestions(randomlySelectQuestions(questionCount));
  }, [questionCount]);

  const generateReversedQuestions = (questions: Question[]): Question[] => {
    return questions.map((question, questionIndex) => {
      const options =
        question.type === "TF"
          ? [
              question.questionText,
              ...originalQuestions
                .filter(
                  (q) =>
                    (q.type === "TF" &&
                      q.correctAnswer !== question.correctAnswer) ||
                    q.type === "N"
                )
.filter((q, qIndex) => qIndex !== questionIndex)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((q) => q.questionText),
            ]
          : [
              question.questionText,
              ...originalQuestions
                .filter(
                  (q, qIndex) =>
                    qIndex !== questionIndex &&
                    q.questionText !== question.questionText
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((q) => q.questionText),
            ];
            while (options.length < 4) {
              const additionalOptions = [
                question.correctAnswer, // Đáp án chính của câu hỏi hiện tại
                // Lấy các correctAnswer và questionText từ các câu hỏi khác
                ...originalQuestions
                  .filter((q) => q.questionText !== question.questionText) // Lọc câu hỏi khác
                  .map((q) => q.correctAnswer) // Lấy correctAnswer của câu hỏi khác
                  .filter(
                    (option) =>
                      option && 
                      !options.includes(option) && 
                      option !== question.correctAnswer // Không trùng với đáp án hiện tại
                  )
                  .sort(() => Math.random() - 0.5), // Xáo trộn đáp án
              ];
            
              // Thêm đáp án cho tới khi có đủ 4 đáp án
              options.push(...additionalOptions.slice(0, 4 - options.length));
            }
        
      const randomizedOptions = options.sort(() => Math.random() - 0.5);

      return {
        quizID: question.quizID,
        questionText: question.correctAnswer || "",
        image: question.image,
        answerA: randomizedOptions[0],
        answerB: randomizedOptions[1],
        answerC: randomizedOptions[2],
        answerD: randomizedOptions[3],
        correctAnswer: question.questionText || "",
        type: question.type,
      };
    });
  };

  const onAnswerClick = (questionIndex: number, option: string) => {
   if (!isSubmitted) {
    setAnswers({ ...answers, [questionIndex]: option });}
  };

  const onTextAnswerChange = (
    questionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isSubmitted) {
    setAnswers({ ...answers, [questionIndex]: event.target.value });}
  };

  const handleSubmit = () => {
    let newScore = 0;
  
    // Kiểm tra từng câu hỏi
    filteredQuestions.forEach((question, index) => {
      // Nếu câu hỏi có đáp án và đáp án đúng
      if (answers[index]?.trim() === question.correctAnswer?.trim()) {
        newScore += 1;
      }
    });
  
    // Cập nhật trạng thái
    setScore(newScore);
    setShowResults(true);
    setIsSubmitted(true);
  };
const handleRetry = () => {
  setAnswers([]);
  setShowResults(false);
  setIsSubmitted(false);
  setScore(0);
  setIsModalVisible(true);
  setQuestions(originalQuestions);
};
  const handleSkip = (index: number) => {
    const nextQuestionId = `question-${index + 1}`;
    const nextQuestionElement = document.getElementById(nextQuestionId);
    if (nextQuestionElement) {
      nextQuestionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleModeSelection = (e: any) => {
    setAnswerMode(e.target.value);
  };

  const handleConfirmModal = () => {
    setFilteredQuestions(randomlySelectQuestions(questionCount));
    setIsModalVisible(false);
  };

  const randomlySelectQuestions = (count: number) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const handleShuffleTerms = () => {
    const reversedQuestions = generateReversedQuestions(originalQuestions);
    setQuestions(reversedQuestions);
  };

  const handleNormalTerms = () => {
    setQuestions(originalQuestions);
  };
  const handleMatchTerms = () => {
    const reversedQuestions = generateReversedQuestions(originalQuestions);
const matchTypeQuestions = createMatchTypeQuestions(
      originalQuestions,
      reversedQuestions
    );
    setQuestions(matchTypeQuestions);
  };
  const randomValue = useMemo(() => Math.floor(Math.random() * 10) + 1, []);
  return (
    <div className="Quiz-Exam" style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Test
      </Title>

      <Modal
        title={t("ChooseAnswerModeandNumberofQuestions")}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Button type="primary" onClick={handleConfirmModal}>
            {t("Confirm")}
          </Button>
        }
        centered
      >
        <div style={{ padding: "16px" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "16px",
            }}
          >
            {t("SelectQuestionType")}
          </p>
          <Radio.Group
            onChange={handleModeSelection}
            value={answerMode}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <Radio value="select">{t("SelectAnswer")}</Radio>
            <Radio value="text">{t("Text")}</Radio>
            <Radio value="random">{t("Random")}</Radio>
          </Radio.Group>

          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              {t("TypeOfTerms")}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
              
                <Button onClick={handleShuffleTerms}>{t("Shuffle")}</Button>
              </div>
              <div>
               
                <Button onClick={handleNormalTerms}>{t("Normal")}</Button>
              </div>
              <div>
               
                <Button onClick={handleMatchTerms}>{t("Match")}</Button>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontWeight: "bold", marginBottom: "16px" }}>
              {t("NumberOfQuestions")}
            </p>
            <Input
              type="number"
              min={1}
              max={questions.length}
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(
                  Math.max(
                    1,
                    Math.min(questions.length, parseInt(e.target.value))
                  )
                )
              }
              placeholder={`Enter number of questions (1 to ${questions.length})`}
              style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
            />
          </div>
        </div>
      </Modal>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setIsModalVisible(true)}
            style={{
              borderRadius: 5,
              border: "2px solid #d9d9d9",
              width: 100,
              height: 40,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            {t("Options")}
          </button>
        </div>
      </header>
      <List
        dataSource={filteredQuestions}
        renderItem={(question, Questionindex) => {
          return (
            <List.Item style={{ display: "flex", justifyContent: "center" }}>
              <Card
                id={`question-${Questionindex}`}
                bordered={false}
                className="card"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Title level={5} style={{ marginBottom: 100 }}>{`Question ${
                  Questionindex + 1
                }`}</Title>
                <p>{question.questionText}</p>
                {
                  // Phần này ảnh vô thì đẩy cái tile lên trên chưa gán cố định được
                  question.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      style={{
                        width: "100%",
                        maxWidth: "300px", // Set maximum width
                        maxHeight: "150px", // Set maximum height to keep the layout intact
                        height: "auto", // Maintain aspect ratio
                        objectFit: "contain", // Ensures the entire image is visible within the set dimensions
                        marginBottom: 16,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  )
                }
                {}
                <small>{t("ChoiceCorrectAnswer")}</small>
                <div className="options-container">
                  {answerMode === "select" ||
                  (answerMode === "random" &&
                    ((question.questionText?.length ?? 0) *
                      randomValue *
                      (question.answerA?.length ?? 0)) %
                      2 ===
                      0) ? (
                    <>
                      {[
                        question.answerA,
                        question.answerB,
                        question.answerC,
                        question.answerD,
                      ]
                        .filter((option) => option !== "")
                        .slice(0, 4)
                        .map((option, idx) => (
                          <div
                            key={`${Questionindex}-${idx}-${option}`}
                            className={`option-item ${
                              showResults
                                ? option?.trim() ===
                                  question.correctAnswer.trim()
                                  ? answers[Questionindex] === option
                                    ? "selected-correct-answer" // Đúng đáp án được chọn
                                    : "correct-answer" // Đáp án đúng không được chọn
                                  : answers[Questionindex] === option
                                  ? "incorrect-answer" // Sai đáp án được chọn
                                  : ""
                                : answers[Questionindex] === option
                                ? "selected-option-unsubmitted" // Đáp án được chọn nhưng chưa submit
                                : ""
                            }`}
                            onClick={() =>
                              onAnswerClick(
                                Questionindex,
                                option?.toString() || ""
                              )
                            }
                            style={{
                              pointerEvents: isSubmitted ? "none" : "auto",
                            }}
                          >
                            {option}
                          </div>
                        ))}
                    </>
                  ) : (
                    <>
                      <Input
                        placeholder="Type your answer"
                        value={answers[Questionindex] || ""}
                        onChange={(event) =>
                          onTextAnswerChange(Questionindex, event)
                        }
                        style={{
                          marginTop: 8,
                          borderColor:
                            showResults &&
                            answers[Questionindex] ===
                              question.correctAnswer.trim()
                              ? "green"
                              : showResults
                              ? "red"
                              : "initial",
                          pointerEvents: isSubmitted ? "none" : "auto",
                        }}
                      />
                      {showResults && (
                        <div style={{ marginTop: 8 }}>
                          {answers[Questionindex] ===
                          question.correctAnswer.trim() ? (
                            <Alert message="Correct!" type="success" showIcon />
                          ) : (
                            <Alert
                              message={`Incorrect! Correct answer: ${question.correctAnswer}`}
                              type="error"
                              showIcon
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="link"
                    onClick={() => handleSkip(Questionindex)}
                    style={{ marginTop: 8 }}
                    disabled={isSubmitted}
                  >
                    {t("YouDontKnow")}
                  </Button>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSubmitted ? (
          <Button
            type="primary"
            style={{ marginTop: 24, padding: "30px 60px" }}
            onClick={handleRetry}
          >
            {t("Retry")}
          </Button>
        ) : (
          <Button
            type="primary"
            style={{ marginTop: 24, padding: "30px 60px" }}
            onClick={handleSubmit}
          >
            {t("SubmitTest")}
          </Button>
        )}
      </div>
      {showResults && (
        <div style={{ marginTop: 24 }}>
          <Alert
            message={`Your Score: ${score} / ${filteredQuestions.length}`}
            type="info"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default QuizExam1;