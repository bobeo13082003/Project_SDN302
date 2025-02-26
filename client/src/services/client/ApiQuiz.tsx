import axios from "../../utils/CustomizeApi";

export const allQuiz = (page: number) => {
    return axios.get(`/quiz/allQuiz`, { params: { page } });
}

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

//update Quiz
export const updateQuiz = (
    quizId: string,
    data: { title: string; description: string; questions: Question[] }
) => {
    return axios.put(`/quiz/updateQuiz/${quizId}`, data);
};

export const countTraffic = (quizId: string) => {
    return axios.put(`/quiz/countTraffic/${quizId}`);
};


export const mostRecentQuiz = (page: number) => {
    return axios.get(`/quiz/mostRecentQuiz`, { params: { page } });
};

export const totalQuiz = () => {
    return axios.get(`/quiz/countQuiz`);
};



export const lastesQuiz = (quizId: string) => {
    return axios.post(`/quiz/lastesQuiz`, {
        quizId
    });
};


export const mostLatesQuiz = (page: number) => {
    return axios.get(`/quiz/mostLatesQuiz`, { params: { page } });
}

export const searchQuizzes = (page: number, searchKey: string) => {
    return axios.get(`/quiz/search`, {
        params: {
            search: searchKey,
            page: page
        }
    });
};

export const getQuestion = (quizId: string) => {
    return axios.get(`/quiz/questionByQuizID/${quizId}`);
};


import { Question } from '../../quiz/QuestionModal'

export const addQuiz = (data: { title: string; description: string; userId: string; questions: Question[] }) => {
    return axios.post(`/quiz/addQuiz`, data);
}

export const userQuizzes = (page: number) => {
    return axios.get(`/quiz/myQuiz`, { params: { page } });
}

export const exportFromExcel = (quizID: string) => {
    return axios.get(`/quiz/exportQuizToExcel/${quizID}`, { responseType: 'blob' });
};

export const addFromExcel = (data: FormData) => {
    return axios.post(`/quiz/addQuizFromExcel`, data);
}