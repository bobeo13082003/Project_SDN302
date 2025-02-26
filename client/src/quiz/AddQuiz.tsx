import React, { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col, message, Spin, Select, Radio, Checkbox, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { Question } from "./QuestionModal"
import { addQuiz, addFromExcel as AddFromExcel } from "../services/client/ApiQuiz";
import { UploadChangeParam } from "antd/es/upload/interface";
import "driver.js/dist/driver.css";
import DefineBtn from "../components/DefineBtn";
import MultiChoice from "../components/MultiChoice";
import TrueFlase from "../components/TrueFlase";
import { FormUploadExcel } from "../components/FormUploadExcel";



interface QuizData {
  title: string;
  description: string;
  userId: string;
  questions: Question[];
}
const { Option } = Select;
const AddQuiz: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ [key: number]: string }>({});
  const [form] = Form.useForm();
  const [selectedForm, setSelectedForm] = useState<"form1" | "form2" | "form3" | "form4" | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string[] }>({});
  const { t } = useTranslation("learnquiz");
  useEffect(() => {
    if (isFormVisible) {
      form.resetFields();
    }
  }, [isFormVisible]);

  const handleImageUpload = (file: File, callback: (base64Image: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      callback(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Read the image file using FileReader
      handleImageUpload(file, (base64Image) => {

        form.setFieldsValue({
          questions: form.getFieldValue("questions").map((question: Question, i: number) =>
            i === index ? { ...question, image: base64Image } : question
          ),
        });
        // Set the preview for the image
        setImagePreview((prev) => ({ ...prev, [index]: base64Image }));
      });
    } else {
      // Reset the questions field in the form with the new image
      form.setFieldsValue({
        questions: form.getFieldValue("questions").map((question: Question, i: number) =>
          i === index ? { ...question, image: "" } : question
        ),
      });
      // Reset the preview for the image
      setImagePreview((prev) => ({ ...prev, [index]: "" }));
    }
  };
  const handleTypeChange = (value: string, index: number) => {
    const updatedQuestions = form.getFieldValue("questions").map((question: Question, i: number) => {
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

  const handleSave = async (values: QuizData) => {
    // Kiểm tra tính hợp lệ của tất cả câu hỏi
    const invalidQuestions = values.questions.filter((question) => {
      const questionType = question.type;

      if (questionType === "N") {
        // Kiểm tra xem đã chọn đáp án đúng nào chưa (correctAnswer)
        return !question.correctAnswer || question.correctAnswer.trim() === "";
      }

      if (questionType === "TF") {
        // Kiểm tra xem đáp án đúng đã được chọn chưa (True/False)
        return !question.correctAnswer;
      }

      return false;
    });

    if (invalidQuestions.length > 0) {
      message.error("Mỗi câu hỏi phải có đáp án đúng được chọn trước khi nộp!");
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

  

  //
 

   
 
  return (
    <div style={{ padding: "20px" }}>
      {/* Buttons to choose the form */}
      <div style={{ marginBottom: "20px" }}>
        <Button
          type={selectedForm === "form1" ? "primary" : "default"}
          onClick={() => {
            setSelectedForm("form1");
            form.resetFields();
            setSelectedAnswers({});
            setImagePreview({});
          }}
        >
          {t("DefineTerm")}
        </Button>
        <Button
          type={selectedForm === "form2" ? "primary" : "default"}
          onClick={() => {
            setSelectedForm("form2");
            form.resetFields();
            setSelectedAnswers({});
            setImagePreview({});
          }}
          style={{ marginLeft: "10px" }}
        >
          {t("MultiChoice")}
        </Button>
        <Button
          type={selectedForm === "form3" ? "primary" : "default"}
          onClick={() => {
            setSelectedForm("form3");
            form.resetFields();
            setSelectedAnswers({});
            setImagePreview({});
          }}
          style={{ marginLeft: "10px" }}
        >
          {t("TrueFalse")}
        </Button>
        <Button
          type={selectedForm === "form4" ? "primary" : "default"}
          onClick={() => {
            setSelectedForm("form4");
            form.resetFields();
            setSelectedAnswers({});
            setImagePreview({});
            
          }}
          style={{ marginLeft: "10px" }}
        >
          {t("AddFromExcel")}
        </Button>
      </div>

      {/* Conditional Rendering of the forms */}
      {selectedForm === "form1" && <DefineBtn></DefineBtn>}

      {selectedForm === "form2" && <MultiChoice />}

      {selectedForm === "form3" && <TrueFlase />}

      {selectedForm === "form4" && (
        <Row justify="center" style={{ marginTop: "50px" }}>
          <Col span={12}>
            <FormUploadExcel
              setIsFormVisible={setIsFormVisible}
             />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AddQuiz;
