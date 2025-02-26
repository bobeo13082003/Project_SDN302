import React from 'react';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './NotFound.scss'; 

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" icon={<HomeOutlined />} onClick={goHome}>
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
