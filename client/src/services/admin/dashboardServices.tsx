import axios from '../../utils/CustomizeApi';
import { UserStats, QuizStats, BlogStats, TopQuizCreatorStats } from '../../types/dashboard';


export const getUserStats = async (): Promise<UserStats> => {
    const response = await axios.get('/dashboard/stats/users');
    return response.data.data; 
};


export const getNewUsersInLastMonth = async (year: number, month: number): Promise<{ newUserCount: number }> => {
    const response = await axios.get(`/dashboard/stats/new-users?year=${year}&month=${month}`);
    return response.data.data;
};


export const getQuizStats = async (): Promise<QuizStats> => {
    const response = await axios.get('/dashboard/stats/quiz');
    return response.data.data; 
};


export const getNewQuizzes = async (year: number, month: number): Promise<{ newQuizzesCount: number }> => {
    const response = await axios.get(`/dashboard/stats/new-quiz?year=${year}&month=${month}`);
    return response.data;
};


export const getBlogsStats = async (): Promise<BlogStats> => {
    const response = await axios.get('/dashboard/stats/blogs');
    return response.data.data; 
};


export const getTopQuizCreator = async (): Promise<TopQuizCreatorStats> => {
    const response = await axios.get('/dashboard/stats/top-quiz');
    return response.data.data;
};
