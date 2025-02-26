import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  addFromExcel as AddFromExcel,
} from "../services/client/ApiQuiz";
import { UploadChangeParam } from 'antd/es/upload';
import { useTranslation } from 'react-i18next';
import { driver } from "driver.js";

interface PropExcel {
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormUploadExcel = ({ setIsFormVisible }: PropExcel) => {
  const [file, setFile] = useState(null);
  const [selectedForm, setSelectedForm] = useState<
    "form1" | "form2" | "form3" | "form4" | null
  >(null);
  const { t } = useTranslation("learnquiz");

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

  const handleUploadChange = (info: UploadChangeParam) => {
    // Instead of checking for upload status, handle it when a file is selected
    if (info.fileList && info.fileList.length > 0) {
      const selectedFile = info.fileList[0].originFileObj;
      if (selectedFile) {
        setFile(selectedFile); // Set the selected file in state
      }
    }
  };



  const steps = [
    {
      element: ".quiz-form",
      popover: {
        title: t("tutorial"),
        description: t("excel"),
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
      element: ".up-load-file",
      popover: {
        title: t("up_load"),
        description: t("up_load_flie"),
      },
    },

    {
      element: ".save-quiz-button",
      popover: {
        title: t("save_quiz"),
        description: t("Save"),
      },
    },
  ];
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial3");
     if (!hasSeenTutorial) {
    const driverObj = driver({ showProgress: true, steps });
    driverObj.drive();
    // Lưu trạng thái vào localStorage
    localStorage.setItem("hasSeenTutorial3", "true");
     }
  }, []);

  return (
    <div>
      <Form className='quiz-form'
        layout="vertical"
        onFinish={handleAddFromExcel}
      >
        {/* Quiz Title */}
        <Form.Item
          label="Quiz Title"
          name="title"
          rules={[{ required: true, message: "Please enter the quiz title." }]}
        >
          <Input className="quiz-title-input" placeholder="Enter quiz title" />
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
          <Input.TextArea
            placeholder="Enter quiz description"
            rows={4}
            className="quiz-description-textarea"
          />
        </Form.Item>

        {/* Excel File Upload */}
        <Form.Item
          label="Upload Excel File"
          name="file"
          rules={[{ required: true, message: "Please upload an Excel file." }]}
        >
          <Upload
            accept=".xlsx"
            beforeUpload={() => false} // Disable automatic upload
            onChange={handleUploadChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} className="up-load-file">
              Select File
            </Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="save-quiz-button"
            block
          >
            Add Quiz from Excel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
