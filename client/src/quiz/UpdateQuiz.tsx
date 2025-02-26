import React, { useEffect, useState } from "react";
import axios from "../utils/CustomizeApi";
import {
  Card,
  List,
  Typography,
  Spin,
  Input,
  Button,
  message,
  Col,
  Form,
  Row,
  Select,
  Radio,
  Checkbox
} from "antd";
import {
  Container,
  Row as BootstrapRow,
  Col as BootstrapCol,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getQuestion as GetQuestion, updateQuiz as UpdateQuizAPI } from "../services/client/ApiQuiz";



const { Paragraph } = Typography;
const { Option } = Select;



interface Question {
  _id: string;
  quizId: string;
  questionText: string;
  image: string | null;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  type: string;
}

interface UpdateQuizProps {
  quizId: string;
  onBack: () => void;
}

const UpdateQuiz: React.FC<UpdateQuizProps> = ({ quizId, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<{ [key: number]: string }>(
    {}
  );
  const { t } = useTranslation("learnquiz");
  const [form] = Form.useForm();
  const [CheckFormTerm, setCheckFormTerm] = useState(false);
  const [checkFormTF, setCheckFormTF] = useState(true);
  // Fetch quiz data
  const fetchQuizData = async () => {
    setLoading(true);
    try {
      const response = await GetQuestion(quizId);
      const quiz = response.data;

      if (Array.isArray(quiz) && quiz.length > 0) {
        setTitle(quiz[0].title || "");
        setDescription(quiz[0].description || "");
        setQuestions(quiz);
      } else {
        setError("No questions found for this quiz.");
      }
    } catch (error) {
      console.error("Failed to fetch quiz data", error);
      setError("Failed to fetch quiz data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const fetchCheckForm = async () => {
    if (questions.length > 0 && questions.every((question)=>question.answerA === "" && question.answerB === "" && question.answerC === "" && question.answerD === "") ) {
      setCheckFormTerm(true);
    }
  }
  const fetchCheckFromTF = async () => {
    if (questions.length > 0 && questions.every((q) => q.type === "TF" && q.answerA === "" && (q.correctAnswer === "False" || q.correctAnswer === "True"))) {
      setCheckFormTF(false);
    }
  }
  useEffect(() => {
    fetchQuizData();
  }, [quizId]);
  useEffect(() => {
    fetchCheckForm();

  })
  useEffect(() => {
    fetchCheckFromTF();
  }, [questions]);
  // Handle question field changes
  const handleQuestionChange = (
    questionId: string,
    key: keyof Question,
    value: string
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q._id === questionId) {
          const updatedQuestion = { ...q, [key]: value };
  
          // Kiểm tra và làm sạch correctAnswer nếu cần
          if (["answerA", "answerB", "answerC", "answerD"].includes(key)) {
            const validAnswers = [
              updatedQuestion.answerA,
              updatedQuestion.answerB,
              updatedQuestion.answerC,
              updatedQuestion.answerD,
            ];
            const validCorrectAnswers = updatedQuestion.correctAnswer
              ? updatedQuestion.correctAnswer
                  .split(`/"'\\`)
                  .filter((ans) => validAnswers.includes(ans))
              : [];
            updatedQuestion.correctAnswer = validCorrectAnswers.join(`/"'\\`);
          }
  
          return updatedQuestion;
        }
        return q;
      })
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => {
      let newQuestion = {
        // Temporary ID for new question
        _id: "",
        quizId,
        questionText: "",
        image: null,
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
        correctAnswer: "",
        type: "N", // Default type
      };

      // Check the first question's `answerA`
      if (prevQuestions.length > 0 && prevQuestions[0].answerA === "") {

        newQuestion = { ...newQuestion, answerA: "", answerB: "", answerC: "", answerD: "" };
      }

      // Check if all questions in `prevQuestions` have `type` as `TF` and `answerA` as ""
      const allAreTFAndEmpty = prevQuestions.every(
        (q) => q.type === "TF" && q.answerA === ""
      );

      if (allAreTFAndEmpty) {
        newQuestion = { ...newQuestion, answerA: "", answerB: "", answerC: "", answerD: "", type: "TF" };
      }

      return [...prevQuestions, newQuestion];
    });
  };
  const handleCorrectAnswerChange = (
    questionId: string,
    answer: string
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q._id === questionId) {
          const correctAnswers = q.correctAnswer ? q.correctAnswer.split(`/"'\\`) : [];
          const index = correctAnswers.indexOf(answer);

          if (index > -1) {
            // Nếu đã có, xóa khỏi mảng
            correctAnswers.splice(index, 1);
          } else {
            // Nếu chưa có, thêm vào mảng
            correctAnswers.push(answer);
          }

          return { ...q, correctAnswer: correctAnswers.join(`/"'\\`) };
        }
        return q;
      })
    );
  };



  const handleImageUpload = (
    file: File,
    callback: (base64Image: string) => void
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      callback(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      handleImageUpload(file, (base64Image) => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q, i) =>
            i === index ? { ...q, image: base64Image } : q
          )
        );
        setImagePreview((prev) => ({ ...prev, [index]: base64Image }));
      });
    } else {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, i) => (i === index ? { ...q, image: null } : q))
      );
      setImagePreview((prev) => ({ ...prev, [index]: "" }));
    }
  };


  const handleSubmit = async () => {
    // Kiểm tra tính hợp lệ của các câu hỏi
    const invalidQuestions = questions.filter(
      (q) => !q.correctAnswer || q.correctAnswer.trim() === ""
    ); if (invalidQuestions.length > 0) {
      // Hiển thị thông báo lỗi nếu có câu hỏi không hợp lệ
      message.error("Please ensure all questions have a valid correct answer.");
      return; // Ngăn không cho lưu dữ liệu
    }

    const data = { title, description, questions };
    console.log("Updating quiz...", data);
    try {
      await UpdateQuizAPI(quizId, data);
      message.success("Quiz updated successfully");
      onBack();
    } catch (error: any) {
      console.error("Error updating quiz:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setError("You do not have permission to update this quiz");
        } else {
          setError("Failed to update quiz. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };


  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p>Loading quiz data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        <Paragraph>{error}</Paragraph>
        <Button onClick={fetchQuizData} type="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Container style={{ paddingTop: "100px" }}>
      <Button
        onClick={onBack}
        variant="secondary"
        style={{ marginBottom: "20px" }}
      >
        ({t("BackToList")})
      </Button>
      <Form form={form} onFinish={handleSubmit}>
        <BootstrapRow className="mb-3">
          <BootstrapCol md={12}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("EditQuizTitle")}
              style={{ marginBottom: "20px" }}
            />
          </BootstrapCol>
          <BootstrapCol md={12}>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("EditQuizDescription")}
              style={{ marginBottom: "20px" }}
            />
          </BootstrapCol>
        </BootstrapRow>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={questions}
          renderItem={(question, index) => (
            <List.Item key={question._id || index}>
              <Card
                title={
                  <Input
                    value={question.questionText}
                    onChange={(e) =>
                      handleQuestionChange(
                        question._id,
                        "questionText",
                        e.target.value
                      )
                    }
                    placeholder={t("EditQuestionText")}
                  />
                }
                style={{ marginBottom: "20px" }}
              ><Form.Item label={t("Image(Optional)")}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  {imagePreview[index] && (
                    <img
                      src={imagePreview[index]}
                      alt="Image Preview"
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        maxHeight: "150px",
                      }}
                    />
                  )}
                   {!imagePreview[index] && question.image && (
    <img
      src={question.image}
      alt="Previous Image"
      style={{
        width: "100%",
        marginTop: "10px",
        maxHeight: "150px",
      }}
    />
  )}
                </Form.Item>

                {(question.type !== "TF" && CheckFormTerm === false) && (
                  <>
                    {["answerA", "answerB", "answerC", "answerD"].map((key) => (
                      <BootstrapRow key={key}>
                        <BootstrapCol md={12}>
                          <Input md={6}
                            value={question[key as keyof Question]}
                            onChange={(e) =>
                              handleQuestionChange(
                                question._id,
                                key as keyof Question,
                                e.target.value
                              )
                            }
                            placeholder={`Answer ${key.charAt(key.length - 1)}`}
                          />
                          <Checkbox
                            checked={question.correctAnswer
                              .split(`/"'\\`)
                              .includes(question[key as keyof Question])}
                            onChange={() =>
                              handleCorrectAnswerChange(
                                question._id,
                                question[key as keyof Question]
                              )

                            }

                          >
                            {t("CorrectAnswer")}
                          </Checkbox>
                        </BootstrapCol>
                      </BootstrapRow>
                    ))}
                    <Input
                      style={{ display: 'none' }}
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          question._id,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      placeholder="Correct Answer"
                    />

                  </>
                )}
                {question.type !== "TF" && CheckFormTerm === true && (
                  <Input
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        question._id,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    placeholder="Correct Answer"
                  />
                )}
                {question.type === "TF" && (<Radio.Group
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(
                      question._id,
                      "correctAnswer",
                      e.target.value
                    )
                  }
                >
                  <Radio value="True">{t("True")}</Radio>
                  <Radio value="False">{t("False")}</Radio>
                </Radio.Group>
                )}
                <Form.Item label={t("SelectQuestionType")}>
                  <Select
                    value={question.type}
                    onChange={(value) => {
                      if (value === "TF" && CheckFormTerm === false) {
                        // Reset answerA, answerB, answerC, answerD và correctAnswer khi chuyển sang TF
                        handleQuestionChange(question._id, "answerA", "True");
                        handleQuestionChange(question._id, "answerB", "False");
                        handleQuestionChange(question._id, "answerC", "");
                        handleQuestionChange(question._id, "answerD", "");
                        handleQuestionChange(question._id, "correctAnswer", ""); // Reset correctAnswer
                      } else if (value === "N") {
                        // Reset correctAnswer khi chuyển sang MultiChoice (N)
                        handleQuestionChange(question._id, "correctAnswer", "");

                        handleQuestionChange(question._id, "answerC", "");
                        handleQuestionChange(question._id, "answerD", "");

                      }
                      handleQuestionChange(question._id, "type", value); // Cập nhật type
                    }}

                  >


                    {checkFormTF === true && CheckFormTerm === false && (
                      <>
                        <Option value="TF">{t("TrueFalse")} (TF)</Option>
                        <Option value="N">{t("MultiChoice")} (N)</Option></>
                    )}
                    {checkFormTF === true && CheckFormTerm === true && (
                  <>     <Option value="TF">{t("TrueFalse")} (TF)</Option>
                       <Option value="N">{t("Define")} (N)</Option></>
                    )}
                    {checkFormTF === false && (

                      <Option value="TF">{t("TrueFalse")} (TF)</Option>

                    )}

                  </Select>
                </Form.Item>
              </Card>
            </List.Item>
          )}
        />

        <Button
          onClick={handleAddQuestion}
          type="dashed"
          style={{ marginBottom: "20px" }}
        >
          {t("AddNewQuestion")}
        </Button>
        <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
          {t("SaveChange")}
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateQuiz;