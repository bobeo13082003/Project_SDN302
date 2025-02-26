/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetQuizzesResponse } from "../../pages/admin/quiz/quiz.type";
import axios from "../../utils/CustomizeApi";

export const userRegister = (
  email: string,
  userName: string,
  password: string
) => {
  return axios.post("/auth/register", { email, userName, password });
};

export const userLogin = (email: string, password: string) => {
  return axios.post("/auth/login", { email, password });
};

export const userForgot = (email: string) => {
  return axios.post("/auth/forgot-password", { email });
};
export const userOtp = (email: string, otp: string) => {
  return axios.post("/auth/otp", { email, otp }, { withCredentials: true });
};
export const userResetPassword = (
  password: string,
  confirmPassword: string
) => {
  return axios.post(
    "/auth/reset-password",
    { password, confirmPassword },
    { withCredentials: true }
  );
};

export const userProfile = () => {
  return axios.get("auth/user-profile");
};

export const editProfile = (userName: string) => {
  return axios.patch("auth/edit-profile", { userName });
};

export const getBlog = (page: number) => {
  return axios.get("blog/getBlog", {
    params: { page },
  });
};

export const detailBlog = (slug: string) => {
  return axios.get("/blog/detailBlog", { params: { slug } });
};

export const likeBlog = (idBlog: string, like: boolean) => {
  return axios.post("/blog/like", { idBlog, like });
};

export const getQuestionByQuizID = (quizId: string) => {
  return axios.get(`/quiz/questionByQuizID/${quizId}`);
};

export const getQuiz = () => {
  return axios.get(`/quiz/getQuiz`);
};

//only users who create quiz can delete it
export const removeQuiz = (quizId: string) => {
  return axios.delete(`/quiz/removeQuiz/${quizId}`);
};

//all users who create quiz can delete it
export const deleteQuiz = (quizId: string) => {
  return axios.delete(`/quiz/deleteQuiz/${quizId}`);
};

//update
export const updateQuiz = (
  quizId: string,
  data: { title: string; description: string; questions: any[] }
) => {
  return axios.put(`/quiz/updateQuiz/${quizId}`, data);
};

// Manage Quiz By Admin
export const getAllQuizByAdmin = () => {
  return axios.get<GetQuizzesResponse>(`/manage-quizzes/allQuiz`);
};

export const removeQuizByAdmin = (quizId: string) => {
  return axios.delete(`/manage-quizzes/removeQuiz/${quizId}`);
};

export const toggleStatusQuizByAdmin = (quizId: string) => {
  return axios.put(`/manage-quizzes/toggleStatusQuiz/${quizId}`);
};

// API: Lấy số lượng blog đã like

export const getLikedBlogCount = async (userId: string) => {
  const response = await axios.get("/blog/liked-blogs/count", {
    params: { userId },
  });
  return response.data.count; // Trả về số lượng blog mà user đã like
};

export const getLabrary = (userId: string) => {
  return axios.get('/labrary/get-all', { params: { userId } });
}

export const addLibrary = (userId: string, quizId: string) => {
  return axios.post('/labrary/add-labrary', { userId, quizId });
}

export const getNotification = () => {
  return axios.get('/notification/get-notification');
}

export const readNotification = () => {
  return axios.patch('/notification/read-notification')
}

export const deleteNotification = (idNotification: string) => {
  return axios.delete('/notification/delete-notification', { params: { idNotification } })
}


export const getAllAds = async () => {
  try {
    const response = await axios.get("/ads/get-ads");
    return response.data;
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};