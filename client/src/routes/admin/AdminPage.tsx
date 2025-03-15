import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLayout from "../../pages/admin/home/AdminHomePage";
import UserManagement from "../../pages/admin/users/UserManagement";
import QuizManage from "../../pages/admin/quiz/QuizManage";
import BlogManage from "../../pages/admin/blog/BlogManage";

const AdminPage = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="user-manage" element={<UserManagement />} />
        <Route path="quiz-manage" element={<QuizManage />} />
        <Route path="blog-manage" element={<BlogManage />} />
      </Route>
    </Routes>
  );
};

export default AdminPage;
