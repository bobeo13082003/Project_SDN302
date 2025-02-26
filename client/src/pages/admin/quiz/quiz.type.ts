export type User = {
  _id: string;
  email: string;
  userName: string;
};

export type Question = {
  _id: string;
  quizId: string;
  questionText: string;
  image: string | null;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  type: "N" | "TF";
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Quiz = {
  _id: string;
  title: string;
  description: string;
  userId: User;
  questions: Question[];
  deleted: boolean;
  traffic: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AddQuizRequest = Pick<Quiz, "title" | "questions"> & {
  description: string;
};

export interface SuccessResponse<T> {
  code: number;
  data: T;
}

export interface GetQuizzesResponse extends SuccessResponse<Quiz[]> {
  totalPage: number;
}
