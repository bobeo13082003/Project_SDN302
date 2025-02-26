import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { adminLogin } from "../../../services/admin/authsServices";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminDoLogin } from "../../../store/reducer/adminReducer";

type FieldType = {
  username: string;
  password: string;
};


const AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {

    try {
      if (values) {
        const userName = values.username;
        const password = values.password;
        const res = await adminLogin(userName.trim(), password.trim());
        console.log(res.data);

        if (res.data && res.data.code === 402) {
          return toast.error(res.data.message);
        }

        if (res.data && res.data.code === 200) {
          toast.success(res.data.message);
          dispatch(adminDoLogin({ role: res.data.role, token: res.data.token }))
          navigate('/admin')
        }

      }
    } catch (error) {
      console.log(error);

    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, padding: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="border border-secondary rounded"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}


export default AdminLogin;
