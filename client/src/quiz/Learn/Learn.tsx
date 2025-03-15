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
import { Question } from "../QuestionModal";
import {useTranslation} from "react-i18next";
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

const QuizletLearnList: React.FC<QuizletLearnListProps> = ({
  questions: originalQuestions,
}) => {
  const { t } = useTranslation("learnquiz");
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
    if (showResults || revealCorrectAnswer || answers[currentQuestionIndex])
      return;

    const question = questions[currentQuestionIndex];
    setAnswers({ ...answers, [currentQuestionIndex]: option });
     setCurrentProgress((prevProgress) => prevProgress + 1);
    if (option.trim() === question.correctAnswer.trim()) {
      setScore((prevScore) => prevScore + 1);
      setTimeout(() => handleNext(), 2000);
    } else {
      setRevealCorrectAnswer(true);
      setShowNextButton(true);
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
      setAnswers({ ...answers, [currentQuestionIndex]: inputAnswer });

      if (inputAnswer.trim() === question.correctAnswer.trim()) {
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
            {t("Question")} {currentQuestionIndex + 1}
          </Title>
          <small style={{ marginTop: 100 }}>
            {t("ChooseTheCorrectAnswer")}
          </small>
          <p>{questions[currentQuestionIndex].questionText}</p>

          {
            // Phần này ảnh nhét vô nhưng khi nhét vô nó đẩy cái title lên không cố định được
            questions[currentQuestionIndex].image && (
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
                  questions[currentQuestionIndex].answerA,
                  questions[currentQuestionIndex].answerB,
                  questions[currentQuestionIndex].answerC,
                  questions[currentQuestionIndex].answerD,
                ]
                  .filter((option) => option)
                  .slice(0, 4) // Loại bỏ các đáp án rỗng
                  .map((option, idx) => (
                    <div
                      key={`${option}-${idx}-${currentQuestionIndex}`} // Đảm bảo `key` luôn duy nhất bằng cách kết hợp `option`, `idx` và `currentQuestionIndex`
                      className={`option-item ${
                        answers[currentQuestionIndex] === option
                          ? answers[currentQuestionIndex].trim() ===
                            questions[currentQuestionIndex].correctAnswer.trim()
                            ? "selected-correct-answer"
                            : "incorrect-answer"
                          : ""
                      } ${
                        revealCorrectAnswer &&
                        option.trim() === question.correctAnswer.trim()
                          ? "correct-answer"
                          : ""
                      }`}
                      onClick={() => onAnswerClick(option?.toString() || "")}
                      style={{
                        pointerEvents:
                          revealCorrectAnswer || answers[currentQuestionIndex]
                            ? "none"
                            : "auto",
                        opacity:
                          revealCorrectAnswer || answers[currentQuestionIndex]
                            ? 0.6
                            : 1,
                      }}
                    >
                      {option}
                    </div>
                  ))}
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
                      answers[currentQuestionIndex] ===
                      questions[currentQuestionIndex].correctAnswer.trim()
                        ? "green" // Đúng đáp án
                        : answers[currentQuestionIndex]
                        ? "red" // Sai đáp án
                        : "initial",
                  }}
                />
                {answers[currentQuestionIndex] && (
                  <div style={{ marginTop: 8, justifyContent: "left" }}>
                    {answers[currentQuestionIndex] ===
                    question.correctAnswer.trim() ? (
                      <></>
                    ) : (
                      <Alert
                        message={`Incorrect! ${
                          revealCorrectAnswer
                            ? `Correct answer: ${question.correctAnswer}`
                            : ""
                        }`}
                        type="error"
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

export default QuizletLearnList;