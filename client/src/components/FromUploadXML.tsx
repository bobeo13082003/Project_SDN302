import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addXmlQuestion as AddFromXML } from '../services/client/ApiQuiz';
import { UploadChangeParam } from 'antd/es/upload';
import { useTranslation } from 'react-i18next';
import { driver } from 'driver.js';

interface PropXML {
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormUploadXML = ({ setIsFormVisible }: PropXML) => {
  const [file, setFile] = useState(null);
  const { t } = useTranslation('learnquiz');
  
  const handleAddFromXML = async (values: any) => {
    if (!file) {
      message.error('Please upload an XML file.');
      return;
    }
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('file',file);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
  }
    try {
      const response = await AddFromXML(formData);
      message.success('Quiz created from XML file successfully!');
      setIsFormVisible(false);
      console.log(response);
    } catch (error) {
      message.error('An unexpected error occurred.');
      console.error('Unexpected Error:', error);
    }
  };

  const handleUploadChange = (info: UploadChangeParam) => {
    if (info.fileList && info.fileList.length > 0) {
      const selectedFile = info.fileList[0].originFileObj;
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  return (
    <div>
      <Form layout='vertical' onFinish={handleAddFromXML}>
        <Form.Item
          label='Quiz Title'
          name='title'
          rules={[{ required: true, message: 'Please enter the quiz title.' }]}
        >
          <Input placeholder='Enter quiz title' />
        </Form.Item>

        <Form.Item
          label='Quiz Description'
          name='description'
          rules={[{ required: true, message: 'Please enter the quiz description.' }]}
        >
          <Input.TextArea placeholder='Enter quiz description' rows={4} />
        </Form.Item>

        <Form.Item
          label='Upload XML File'
          name='file'
          rules={[{ required: true, message: 'Please upload an XML file.' }]}
        >
          <Upload
            accept='.xml'
            beforeUpload={() => false}
            onChange={handleUploadChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            Add Quiz from XML
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};