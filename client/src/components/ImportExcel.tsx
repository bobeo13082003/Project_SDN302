import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Spin,
  Select,
  Radio,
  Checkbox,
  Upload,
} from "antd";
import { Question } from "../quiz/QuestionModal";
import { useTranslation } from "react-i18next";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  addQuiz,
  addFromExcel as AddFromExcel,
} from "../services/client/ApiQuiz";
import "driver.js/dist/driver.css";
import { driver } from "driver.js";

interface QuizData {
  title: string;
  description: string;
  userId: string;
  questions: Question[];
}
const { Option } = Select;
const ImportExcel = () => {
       const [isFormVisible, setIsFormVisible] = useState(false);
       const [loading, setLoading] = useState(false);
       const [imagePreview, setImagePreview] = useState<{
         [key: number]: string;
       }>({});
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
       
        const [file, setFile] = useState(null);
        const handleUploadChange = (info: UploadChangeParam) => {
          // Instead of checking for upload status, handle it when a file is selected
          if (info.fileList && info.fileList.length > 0) {
            const selectedFile = info.fileList[0].originFileObj;
            if (selectedFile) {
              setFile(selectedFile); // Set the selected file in state
            }
          }
        };

       //Driver js
       const steps = [
         {
           element: ".quiz-title-input",
           popover: {
             title: t("tutorial"),
             description: t("true_false"),
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
       const handleAddFromExcel = async (values: FormValues) => {
         if (!file) {
           message.error("Please upload an Excel file.");
           return;
         }
         const formData = new FormData();
         formData.append("title", values.title);
         formData.append("description", values.description);
         formData.append("file", file);
         try {
           console.log(formData);
           const response = await AddFromExcel(formData);
           message.success("Quiz created from Excel file successfully!");
           setIsFormVisible(false);
           setSelectedForm(null);
           console.log(response);
         } catch (error) {
           message.error("An unexpected error occurred.");
           console.error("Unexpected Error:", error);
         }
       };



       useEffect(() => {
         const hasSeenTutorial2 = localStorage.getItem("hasSeenTutorial2");
         console.log(hasSeenTutorial2);

         if (!hasSeenTutorial2) {
           const driverObj = driver({ showProgress: true, steps });
           driverObj.drive();
           // Lưu trạng thái vào localStorage
           localStorage.setItem("hasSeenTutorial2", "true");
         }
       }, []); 


  return (
    <div>
      ImportExcel (
      <Row justify="center" style={{ marginTop: "50px" }}>
        <Col span={12}>
          <Form layout="vertical" onFinish={handleAddFromExcel}>
            {/* Quiz Title */}
            <Form.Item
              label="Quiz Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the quiz title." },
              ]}
            >
              <Input placeholder="Enter quiz title" />
            </Form.Item>

            {/* Quiz Description */}
            <Form.Item
              label="Quiz Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter the quiz description.",
                },
              ]}
            >
              <Input.TextArea placeholder="Enter quiz description" rows={4} />
            </Form.Item>

            {/* Excel File Upload */}
            <Form.Item
              label="Upload Excel File"
              name="file"
              rules={[
                { required: true, message: "Please upload an Excel file." },
              ]}
            >
              <Upload
                accept=".xlsx"
                beforeUpload={() => false} // Disable automatic upload
                onChange={handleUploadChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add Quiz from Excel
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      )
    </div>
  );
};

export default ImportExcel;
