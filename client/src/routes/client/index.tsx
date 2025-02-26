// Index.tsx
import { Route, Routes } from "react-router-dom";
import App from "../../App";
import Login from "../../pages/client/auth/Login";
import Register from "../../pages/client/auth/Register";
import Forgot from "../../pages/client/auth/Forgot";
import Otp from "../../pages/client/auth/Otp";
import ResetPassword from "../../pages/client/auth/ResetPassword";
import Profile from "../../pages/client/auth/Profile";
import Library from "../../pages/client/homeAuth/Library";
import CardContent from "../../pages/client/homeAuth/Card";
import Not from "../../layout/Notification";
import FlashCard from "../../pages/client/homeAuth/FlashCard";

import Explanations from "../../pages/client/homeAuth/BlogPage";
import BlogDetail from "../../pages/client/blog/BlogDetail";
import HomeQuizList from "../../pages/client/homeAuth/HomeQuizList";
import Lobby from "../../pages/client/home/page/";

import AdminLayout from "../../pages/admin/home/AdminHomePage";
import UserManagement from "../../pages/admin/users/UserManagement";
import QuizManage from "../../pages/admin/quiz/QuizManage";
import BlogManage from "../../pages/admin/blog/BlogManage";
import AdminDashboard from "../../pages/admin/home/AdminDashboard";
import AdminLogin from "../../pages/admin/home/AdminLogin";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import GeneralSetting from "../../pages/admin/generalSetting/GeneralSetting";
import UserLibrary from "../../pages/client/userLibrary/UserLibrary";
import InputSearch from "../../components/InputSearch";
import SearchQuiz from "../../quiz/SearchQuiz";
import QuestionDetail from "../../quiz/QuizDetails";
import NotFound from "../../pages/client/Error/NotFound/NotFound"
import ListQuiz from "../../quiz/ListQuiz"
import AdsManage from "../../pages/admin/ads/AdsManage";
import CommentManage from "../../pages/admin/comment/CommentManage";

const Index = () => {
  const admin = useSelector((state: RootState) => state.admin.admin);
  const token = useSelector((state: RootState) => state.user.user.token);

  return (
    <Routes>
      <Route path="/" element={<App />}>
        {token ? (
          <Route index element={<HomeQuizList />} />
        ) : (
          <Route index element={<Lobby />} />
        )}
        <Route path="/home" element={<HomeQuizList />} />
        <Route path="/library" element={<Library />} />
        <Route path="/card" element={<CardContent />} />
        <Route path="/flash-card" element={<FlashCard />} />
        <Route path="/explanations" element={<Explanations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/otp/:email" element={<Otp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/blog/:slugBlog" element={<BlogDetail />} />
        <Route path="/mylibrary" element={<UserLibrary />} />
        <Route path="/search" element={<InputSearch />} />
        <Route path="/search/:searchKey" element={<SearchQuiz />} />
        <Route path="/quiz" element={<ListQuiz />} />
        <Route path="/quiz/quiz-details/:quizId" element={<QuestionDetail />} />
      </Route>

      {/* search routes */}

      <Route path="*" element={<NotFound />} />

      {/* <Route path="/quiz-details" element={<QuestionsByQuizId />} /> */}

      {/* admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {admin && admin.role === "admin" && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route
            path="user-manage"
            element={<UserManagement />}
            key="user-manage"
          ></Route>
          <Route
            path="quiz-manage"
            element={<QuizManage />}
            key="quiz-manage"
          />
          <Route
            path="blog-manage"
            element={<BlogManage />}
            key="blog-manage"
          />
           <Route
  path="comment-manage"
  element={<CommentManage />}
  key="comment-manage"
/>
          <Route path="ads-manage" element={<AdsManage />} key="ads-manage" />
          <Route path="general-setting" element={<GeneralSetting />} />
        </Route>
      )}
    </Routes>
  );
};

export default Index;
