import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Alert,
  Progress,
  Modal,
  Input,
  Radio,
} from "antd";
import "./examLearn.scss";
import { Question } from "../../QuestionModal";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
const { Title } = Typography;

interface QuizletLearnListProps {
  questions: Question[];
}

// Tạo câu hỏi ngẫu nhiên từ original và matchingReversed
const createMatchTypeQuestions = (
  questions: Question[],
  reversedQuestions: Question[]
): Question[] => {
  return questions.map((original, originalIndex) => {
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

const QuizletLearnList1: React.FC<QuizletLearnListProps> = ({
  questions: originalQuestions,
}) => {
  const {t} = useTranslation("learnquiz");
  const [questions, setQuestions] = useState<Question[]>(originalQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [revealCorrectAnswer, setRevealCorrectAnswer] = useState(false);
  const [inputAnswer, setInputAnswer] = useState("");
  const [questionType, setQuestionType] = useState("select");
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const[currentProgress,setCurrentProgress] = useState(0);
  const[correctAnswersArray,setCorrectAnswersArray] = useState<string[]>([]);
  const[completed,setCompleted] = useState(false);
  const {navigate} = useNavigate();
  useEffect(() => {
    if (questionType === "both") {
      const types = questions.map(() =>
        Math.random() < 0.5 ? "select" : "input"
      );
      setQuestionTypes(types);
    } else {
      setQuestionTypes(Array(questions.length).fill(questionType));
    }
  }, [questionType, questions]);
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
                question.correctAnswer.split(`/"'\\`).join(","), // Đáp án chính của câu hỏi hiện tại
                // Lấy các correctAnswer và questionText từ các câu hỏi khác
                ...originalQuestions
                  .filter((q) => q.questionText !== question.questionText) // Lọc câu hỏi khác
                  .map((q) => q.correctAnswer.split(`/"'\\`).join(",")) // Lấy correctAnswer của câu hỏi khác
                  .filter(
                    (option) =>
                      option && 
                      !options.includes(option) && 
                      option !== question.correctAnswer.split(`/"'\\`).join(",") // Không trùng với đáp án hiện tại
                  )
                  .sort(() => Math.random() - 0.5), // Xáo trộn đáp án
              ];
            
              // Thêm đáp án cho tới khi có đủ 4 đáp án
              options.push(...additionalOptions.slice(0, 4 - options.length));
            }
      const randomizedOptions = options.sort(() => Math.random() - 0.5);

      return {
        quizID: question.quizID,
        questionText: question.correctAnswer.split(`/"'\\`).join(",") || "",
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

  const handleQuestionTypeSelection = (type: string) => {
    setQuestionType(type);
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
    const matchQuestions = createMatchTypeQuestions(
      originalQuestions,
      reversedQuestions
    );
    setQuestions(matchQuestions);
  };

  const handleConfirm = () => {
    setIsModalVisible(false);
  };

  const onAnswerClick = (option: string) => {
    if (showResults || revealCorrectAnswer) return;
  
    const question = questions[currentQuestionIndex];
    const correctAnswersArray = question.correctAnswer.split(`/"'\\`).filter(Boolean); // Tách mảng đáp án chính xác
    const selectedAnswers = answers[currentQuestionIndex]
      ? answers[currentQuestionIndex].split(`/"'\\`) // Tách mảng đã chọn
      : [];
  
    // Thêm hoặc xóa đáp án được chọn vào danh sách
    const updatedAnswers = selectedAnswers.includes(option)
      ? selectedAnswers.filter((answer) => answer !== option)
      : [...selectedAnswers, option];
  
    // Cập nhật danh sách đáp án đã chọn
    setAnswers({ ...answers, [currentQuestionIndex]: updatedAnswers.join(`/"'\\`) });
  
    // Chỉ kiểm tra khi người dùng chọn đủ đáp án
    if (updatedAnswers.length === correctAnswersArray.length) {
      const isCorrect = updatedAnswers.sort().join(",") === correctAnswersArray.sort().join(",");
    setCompleted(true);
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        setTimeout(() => handleNext(), 2000);
      } else {
        setRevealCorrectAnswer(true);
        setShowNextButton(true);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAnswer(event.target.value);
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const question = questions[currentQuestionIndex];
      const correctAnswersArray = question.correctAnswer
        .split(`/"'\\`)
        .filter((ans) => ans.trim() !== "");
      const correctAnswerString = correctAnswersArray.join(",");
  
      setAnswers({ ...answers, [currentQuestionIndex]: [inputAnswer] });
  
      if (inputAnswer === correctAnswerString) {
        setScore((prevScore) => prevScore + 1);
        setTimeout(() => handleNext(), 2000);
      }
      setRevealCorrectAnswer(true);
      setShowNextButton(true);
    }
  };

  const handleNext = () => {
    setShowNextButton(false);
    setRevealCorrectAnswer(false);
    setInputAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  const handleRevealAnswer = () => {
    setRevealCorrectAnswer(true);
    setShowNextButton(true);
    setAnswers({ ...answers, [currentQuestionIndex]: "incorrect" }); // Mark as incorrect
  };

  const handleRetry = () => {
    setQuestions(questions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setShowNextButton(false);
    setRevealCorrectAnswer(false);
    setInputAnswer("");
    setCompleted(false);
  };

  const question = questions[currentQuestionIndex];
  const progressPercentage = (
    (Object.keys(answers).length / questions.length) *
    100
  ).toFixed(0);
  const currentQuestionType = questionTypes[currentQuestionIndex] || "select";

  return (
    <div style={{ padding: 24 }} className="Learn-Question">
      <Modal
        title={t("SelectQuestionType")}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Button
            type="primary"
            onClick={handleConfirm}
            style={{ marginTop: 16 }}
          >
            {t("Confirm")}
          </Button>
        }
      >
        <Title level={4} style={{ marginBottom: "16px" }}>
          {t("SelectQuestionType")}
        </Title>
        <Radio.Group
          onChange={(e) => handleQuestionTypeSelection(e.target.value)}
          defaultValue="select"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Radio value="select">{t("SelectAnswer")}</Radio>
          <Radio value="input">{t("InputAnswer")}</Radio>
          <Radio value="both">{t("Both")}</Radio>
        </Radio.Group>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Title level={4} style={{ marginBottom: "16px" }}>
            {t("TypeOfTerms")}
          </Title>
          <div>
            <Button onClick={handleShuffleTerms}>{t("ShuffleTerms")}</Button>
          </div>
          <div>
            <Button onClick={handleNormalTerms}>{t("NormalTerms")}</Button>
          </div>
          <div>
            <Button onClick={handleMatchTerms}>{t("MatchTerms")}</Button>
          </div>
        </div>
      </Modal>

      <Title level={2} style={{ marginBottom: 24 }}>
        {t("Learn")}
      </Title>
      <Button className="btnFlash" onClick={() => navigate.back()}>{t("Back")}</Button>
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Progress
          percent={parseFloat(progressPercentage)}
          status="active"
          style={{ width: "50%" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          bordered={false}
          className="card"
          style={{ marginBottom: 16, paddingTop: 0 }}
        >
          <Title level={5} style={{ marginBottom: 100, marginTop: 0 }}>
            {t("Question")}
            {currentQuestionIndex + 1}
          </Title>

          <small style={{ marginTop: 100 }}>
            {t("ChooseTheCorrectAnswer")}
          </small>
          <p></p>
          {currentQuestionType === "select" && (
            <small style={{ marginTop: 100 }}>
              {t("Choice")}{" "}
              {question.correctAnswer.split(`/"'\\`).filter(Boolean).length}{" "}
              {t("Answer")}
            </small>
          )}

          <p>{question.questionText}</p>

          {
            // Phần này ảnh nhét vô nhưng khi nhét vô nó đẩy cái title lên không cố định được
            question.image && (
              <img
                src={question.image}
                alt="Question"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  maxHeight: "150px",
                  height: "auto",
                  objectFit: "contain",
                  marginBottom: 16,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )
          }

          <div className="options-container">
            {currentQuestionType === "select" ? (
              <>
                {[
                  question.answerA,
                  question.answerB,
                  question.answerC,
                  question.answerD,
                ]
                  .filter((option) => option !== "" && option !== undefined) // Lọc các câu trả lời rỗng
                  .slice(0, 4)
                  .map((option, idx) => {
                    const selectedAnswers =
                      answers[currentQuestionIndex]?.split(`/"'\\`) || [];
                    const isSelected =
                      option && selectedAnswers.includes(option);
                    const isCorrect =
                      option &&
                      question.correctAnswer.split(`/"'\\`).includes(option);
                    const isAnswerComplete =
                      selectedAnswers.length >=
                      question.correctAnswer.split(`/"'\\`).filter(Boolean)
                        .length;
                    return (
                      <div
                        key={`${currentQuestionIndex}-${idx}-${option}`}
                        className={`option-item ${
                          completed
                            ? isSelected && isCorrect && isAnswerComplete
                              ? "selected-correct-answer" // Đáp án được chọn và đúng
                              : isSelected && !isCorrect && isAnswerComplete
                              ? "incorrect-answer" // Đáp án được chọn và sai
                              : !isSelected && isCorrect && isAnswerComplete
                              ? "correct-answer" // Đáp án không được chọn nhưng đúng
                              : ""
                            : showNextButton && !completed && isCorrect
                            ? "correct-answer" // Đáp án đúng khi nhấn nút tiếp và chưa hoàn thành
                            : isSelected && !completed
                            ? "selected-option"
                            : ""
                        }`}
                        onClick={() => onAnswerClick(option || "")}
                        style={{
                          pointerEvents: revealCorrectAnswer ? "none" : "auto",
                          opacity: revealCorrectAnswer ? 0.6 : 1,
                        }}
                      >
                        {option}
                      </div>
                    );
                  })}
              </>
            ) : currentQuestionType === "input" ? (
              <>
                <Input
                  placeholder="Type your answer here"
                  value={inputAnswer}
                  onChange={handleInputChange}
                  onKeyPress={handleInputKeyPress}
                  style={{
                    marginTop: 16,
                    borderColor:
                      answers[currentQuestionIndex] ==
                      question.correctAnswer.split(`/"'\\`).join(",")
                        ? "green" // Đúng đáp án
                        : answers[currentQuestionIndex]
                        ? "red" // Sai đáp án
                        : "initial",
                  }}
                />
                {answers[currentQuestionIndex] && (
                  <div style={{ marginTop: 8, justifyContent: "left" }}>
                    {answers[currentQuestionIndex] ===
                    question.correctAnswer.split(`/"'\\`).join(",") ? (
                      <></>
                    ) : (
                      <Alert
                        message={`Correct answer: ${question.correctAnswer
                          .split(`/"'\\`)
                          .filter((ans) => ans.trim() !== "")
                          .join(",")}`}
                        type="info"
                        showIcon
                      />
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>

          {!showNextButton &&
            !revealCorrectAnswer &&
            !answers[currentQuestionIndex] && (
              <Button
                type="link"
                style={{ marginTop: 16, display: "block", margin: "0 auto" }}
                onClick={handleRevealAnswer}
              >
                {t("YouDontKnow")}
              </Button>
            )}
        </Card>
        <div></div>
      </div>
      <div style={{ justifyContent: "flex-end", display: "flex" }}>
        {showNextButton && (
          <Button
            type="primary"
            style={{ marginTop: 16, width: "100px", height: "50px" }}
            onClick={handleNext}
          >
            {t("Next")}
          </Button>
        )}
      </div>
      {showResults && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Alert
            message={`You scored ${score} out of ${questions.length}`}
            type="info"
            showIcon
          />
          <Button
            type="primary"
            onClick={handleRetry}
            style={{ marginTop: 16 }}
          >
            {t("Retry")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizletLearnList1;
