import axios from "../../utils/CustomizeApi";

//postComment
export const postComment = (data: any) => {
  return axios.post("/comment", data);
};

export const editComment = (data: any) => {
  return axios.put("/comment", data);
};

export const deleteComment = (commentId: any) => {
  return axios.delete(`/comment/${commentId}`);
};

export const getAllComment = (filter={}) => {
  return axios.post(`/comment/AllComment`, filter);
};

export const adminDeleteComment = (commentId: any) => {
  return axios.delete(`/comment/admin/${commentId}`);
};