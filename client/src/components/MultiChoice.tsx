import React, { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col, message, Spin, Select, Radio, Checkbox, Upload } from "antd";
import { Question } from "../quiz/QuestionModal";
import { useTranslation } from 'react-i18next';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { addQuiz } from '../services/client/ApiQuiz';
import "driver.js/dist/driver.css";
import { driver } from "driver.js";


interface QuizData {
  title: string;
  description: string;
  userId: string;
  questions: Question[];
}
const { Option } = Select;
const MultiChoice = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<{ [key: number]: string }>(
      {}
    );
    const [form] = Form.useForm();
    const [selectedForm, setSelectedForm] = useState<
      "form1" | "form2" | "form3" | "form4" | null
    >(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{
      [key: number]: string[];
    }>({});
    const { t } = useTranslation("tutorial");

    const handleImageChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
        // Read the image file using FileReader
        handleImageUpload(file, (base64Image) => {
          form.setFieldsValue({
            questions: form
              .getFieldValue("questions")
              .map((question: Question, i: number) =>
                i === index ? { ...question, image: base64Image } : question
              ),
          });
          // Set the preview for the image
          setImagePreview((prev) => ({ ...prev, [index]: base64Image }));
        });
      } else {
        // Reset the questions field in the form with the new image
        form.setFieldsValue({
          questions: form
            .getFieldValue("questions")
            .map((question: Question, i: number) =>
              i === index ? { ...question, image: "" } : question
            ),
        });
        // Reset the preview for the image
        setImagePreview((prev) => ({ ...prev, [index]: "" }));
      }
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

    const handleSave = async (values: QuizData) => {
      // Kiểm tra tính hợp lệ của tất cả câu hỏi
      const invalidQuestions = values.questions.filter((question) => {
        const questionType = question.type;

        if (questionType === "N") {
          // Kiểm tra xem đã chọn đáp án đúng nào chưa (correctAnswer)
          return (
            !question.correctAnswer || question.correctAnswer.trim() === ""
          );
        }

        if (questionType === "TF") {
          // Kiểm tra xem đáp án đúng đã được chọn chưa (True/False)
          return !question.correctAnswer;
        }

        return false;
      });

      if (invalidQuestions.length > 0) {
        message.error(
          "Mỗi câu hỏi phải có đáp án đúng được chọn trước khi nộp!"
        );
        return; // Dừng lại nếu phát hiện lỗi
      }

      // Nếu dữ liệu hợp lệ, tiến hành gửi API
      setLoading(true);
      try {
        await addQuiz(values);
        message.success("Quiz saved successfully!");
        setIsFormVisible(false);
        setSelectedForm(null);
      } catch (error: unknown) {
        console.error("Unexpected Error:", error);
        message.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
     const handleTypeChange = (value: string, index: number) => {
       const updatedQuestions = form
         .getFieldValue("questions")
         .map((question: Question, i: number) => {
           if (i === index) {
             if (value === "TF") {
               return {
                 ...question,
                 answerA: "True",
                 answerB: "False",
                 answerC: "",
                 answerD: "",
               };
             }
           }
           return question;
         });
       form.setFieldsValue({ questions: updatedQuestions });
     };

//Driver 

const steps = [
  {
    element: ".quiz-title-input",
    popover: {
      title: t("tutorial"),
      description: t("multicol"),
    },
  },
  {
    element: ".quiz-title-input",
    popover: {
      title: t("quiz_title"),
      description: t("input_title"),
    },
  },
  {
    element: ".quiz-description-textarea",
    popover: {
      title: t("quiz_description"),
      description: t("description"),
    },
  },
  {
    element: ".add-question-button",
    popover: {
      title: t("add_new_question"),
      description: t("add"),
    },
  },

  {
    element: ".save-quiz-button",
    popover: {
      title: t("save_quiz"),
      description: t("save"),
    },
  },
];

// const driverObj = driver({
//   showProgress: true,
//   steps: steps,
// });

// driverObj.drive();
 useEffect(() => {
   const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
   console.log(hasSeenTutorial);

   if (!hasSeenTutorial) {
     const driverObj = driver({ showProgress: true, steps });
     driverObj.drive();
     // Lưu trạng thái vào localStorage
     localStorage.setItem("hasSeenTutorial", "true");
   }
 }, []);  
  return (
    <div>
      <Form
        form={form}
        onFinish={handleSave}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label={t("QuizTitle")}
          name="title"
          rules={[{ required: true, message: "Quiz title is required!" }]}
        >
          <Input
            className="quiz-title-input"
            placeholder={t("EnterQuizTitle")}
          />
        </Form.Item>

        <Form.Item
          label={t("quiz_description")}
          name="description"
          style={{ marginBottom: "50px" }}
        >
          <Input.TextArea
            className="quiz-description-textarea"
            placeholder={t("EnterQuizDescription")}
          />
        </Form.Item>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.key}
                  style={{
                    marginBottom: "16px",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={24}>
                      <Form.Item
                        {...field}
                        name={[field.name, "questionText"]}
                        label={t("QuestionText")}
                        rules={[
                          {
                            required: true,
                            message: "Question text is required!",
                          },
                        ]}
                      >
                        <Input placeholder={t("EnterQuestionText")} />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        {...field}
                        name={[field.name, "image"]}
                        label={t("ImageOptional")}
                      >
                        <input
                          type="file"
                          accept="image/*,jpeg,png,jpg,gif,webp,gif,svg"
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
                      </Form.Item>
                    </Col>

                    {form.getFieldValue(["questions", index, "type"]) ===
                      "N" && (
                      <>
                        {["A", "B", "C", "D"].map((option) => (
                          <Col
                            span={24}
                            key={option}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, `answer${option}`]}
                              label={`Answer ${option}`}
                              rules={
                                option === "A" || option === "B"
                                  ? [{ required: true,message:"Answer is required!" }]
                                  : []
                              }
                              style={{ flex: 1 }}
                            >
                              <Input placeholder={`Enter answer ${option}`} />
                            </Form.Item>

                            {/* Checkbox to select multiple correct answers */}
                            <Checkbox
                              checked={selectedAnswers[index]?.includes(option)}
                              onChange={(e) => {
                                const currentValue =
                                  form.getFieldValue("questions")[index][
                                    `answer${option}`
                                  ];
                                setSelectedAnswers((prev) => {
                                  const updated = prev[index]
                                    ? [...prev[index]]
                                    : [];
                                  if (e.target.checked) {
                                    updated.push(option); // Add to selected answers
                                  } else {
                                    const idx = updated.indexOf(option);
                                    if (idx !== -1) updated.splice(idx, 1); // Remove from selected answers
                                  }

                                  // Update correctAnswer in the form
                                  form.setFieldsValue({
                                    questions: form
                                      .getFieldValue("questions")
                                      .map((q, i) =>
                                        i === index
                                          ? {
                                              ...q,
                                              correctAnswer: updated
                                                .map(
                                                  (opt) =>
                                                    form.getFieldValue(
                                                      "questions"
                                                    )[index][`answer${opt}`]
                                                )
                                                .join(`/"'\\`),
                                            }
                                          : q
                                      ),
                                  });
                                  return { ...prev, [index]: updated };
                                });
                              }}
                            >
                              {t("CorrectAnswer")}
                            </Checkbox>
                          </Col>
                        ))}
                      </>
                    )}
                    {form.getFieldValue(["questions", index, "type"]) ===
                      "TF" && (
                      <Col span={24}>
                        <Form.Item
                          {...field}
                          name={[field.name, "correctAnswer"]}
                          label="Correct Answer"
                          rules={[{ required: true,message:"Correct answer is required !" }]}
                        >
                          <Radio.Group>
                            <Radio value="True">{t("True")}</Radio>
                            <Radio value="False">{t("False")}</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    )}

                    <Col span={24}>
                      <Form.Item
                        {...field}
                        name={[field.name, "type"]}
                        label={t("SelectQuestionType")}
                        rules={[{ required: true }]}
                      >
                        <Select
                          placeholder={t("SelectQuestionType")}
                          onChange={(value) => handleTypeChange(value, index)}
                        >
                          <Option value="N">{t("multicol")}(N)</Option>
                          <Option value="TF">{t("TrueFalse")} (TF)</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Button
                        type="dashed"
                        onClick={() => remove(field.name)}
                        icon={<MinusCircleOutlined />}
                        block
                      >
                        {t("Remove")}
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Form.Item>
                <Button
                  className="add-question-button"
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  {t("AddNewQuestion")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading} className='save-quiz-button'>
            {loading ? <Spin /> : "Save Quiz "}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default MultiChoice