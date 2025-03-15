import { memo, useEffect, useState } from "react";
import ButtonAntd from "../../../components/Button";
import {
  deleteComment,
  editComment,
  postComment,
} from "../../../services/client/ApiComment";
import { Avatar, Space } from "antd";
import { toast } from "react-toastify";
import Profile from "../auth/Profile";
import { userProfile } from "../../../services/client/ApiServies";
import { useNavigate } from "react-router-dom";

const CommentContainer = ({
  comments,
  blogId,
  afterComment = () => {},
}: any) => {
  const [profile, setProfile] = useState<any>();
  const [comment, setComment]: any = useState();
  const [replyId, setReplyId] = useState();
  const [reply, setReply]: any = useState();
  const [editId, setEditId]: any = useState();
  const [commentEdit, setCommentEdit]: any = useState();
  const navigate = useNavigate();
  const SubmitC = async () => {
    if (comment?.length > 0) {
      await postComment({ content: comment, blogId });
      await afterComment();
      setComment("");
    } else {
      toast.error("Comment underfined");
    }
  };

  const SubmitR = async (commentId: any) => {
    if (reply?.length > 0) {
      await postComment({ content: reply, blogId, commentId });
      await afterComment();
      setReply("");
      setReplyId(undefined);
    } else toast.error("Reply underfined");
  };

  const SubmitE = async () => {
    if (commentEdit?.length > 0) {
      await editComment({ commentId: editId, content: commentEdit });
      await afterComment();
      setCommentEdit("");
      setEditId(undefined);
    } else {
      toast.error("Edit Comment underfined");
    }
  };

  const SubmitD = async (commentId: any) => {
    await deleteComment(commentId);
    await afterComment();
    toast.success("Delete Comment successfully");
  };

  const getProfile = async () => {
    try {
      const res = await userProfile();
      if (res.data && res.data.code === 401) {
        navigate("/login");
      } else {
        if (res.data && res.data?.code === 200) {
          setProfile(res.data.user);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <div className="contaner">
        <div className="flex items-center pr-20">
          <div className="mr-3">
            <Space>
              <Avatar style={{ backgroundColor: "orange", color: "white" }}>
                {profile?.userName?.charAt(0).toUpperCase()}
              </Avatar>
            </Space>
          </div>
          <div className="w-full">
            <input
              className="w-10/12 mr-5 rounded-lg py-1"
              value={comment}
              onChange={(e: any) => setComment(e.target.value)}
            />
            <ButtonAntd
              onClick={() => SubmitC()}
              type="default"
              content="Comment"
            />
          </div>
        </div>

        {/* comment list */}
        <div className="px-10 pt-4 text-base">
          {comments.map((c: any) => (
            <div className="mb-4">
              <div className="flex items-center">
                <Space>
                  <Avatar style={{ backgroundColor: "orange", color: "white" }}>
                    {c?.user?.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </Space>
                <div className="ml-3">
                  <div className="font-medium">{c?.user.userName} - {convertToIndonesiaDateTime(c.createdAt)}</div>
                  {editId === c?._id ? (
                    <div className="flex">
                      <input
                        className="py-1 rounded-lg w-4/5 mb-3 mr-3"
                        value={commentEdit}
                        onChange={(e: any) => setCommentEdit(e.target.value)}
                        placeholder="Edit this comment"
                      />
                      <ButtonAntd
                        onClick={SubmitE}
                        type="default"
                        content="Edit"
                      />
                    </div>
                  ) : (
                    <div>{c?.content}</div>
                  )}
                </div>
              </div>
              <div className="flex text-sm flex justify-end my-2">
                  <div
                    className="hover:text-blue-500 mx-2"
                    onClick={() => {
                      setReplyId(c._id);
                      setReply("");
                    }}
                  >
                    reply
                  </div>

                  {c?.user._id === profile?._id && (
                    <>
                      <div
                        className="hover:text-blue-500 mx-2"
                        onClick={() => {
                          setEditId(c._id);
                          setCommentEdit(c.content);
                        }}
                      >
                        edit
                      </div>

                      <div
                        onClick={() => SubmitD(c._id)}
                        className="hover:text-red-500 mx-2"
                      >
                        delete
                      </div>
                    </>
                  )}
              </div>
              {replyId === c?._id && (
                <div className="flex">
                  <input
                    className="py-1 rounded-lg w-4/5 mb-3 mr-3"
                    value={reply}
                    onChange={(e: any) => setReply(e.target.value)}
                    placeholder="Reply this comment"
                  />
                  <ButtonAntd
                    onClick={() => SubmitR(c?._id)}
                    type="default"
                    content="Reply"
                  />
                </div>
              )}
              {c?.replies?.length > 0 &&
                c?.replies.map((r: any) => (
                  <div className="pl-10 mb-4">
                    <div className=" flex items-center mb-2">
                      <Space>
                        <Avatar
                          style={{ backgroundColor: "orange", color: "white" }}
                        >
                          {r?.user?.userName?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Space>
                      <div className="ml-3">
                        <div className="font-medium">{r?.user.userName} - {convertToIndonesiaDateTime(r.createdAt)}</div>
                        {editId === r?._id ? (
                          <div className="flex">
                            <input
                              className="py-1 rounded-lg w-4/5 mb-3 mr-3"
                              value={commentEdit}
                              onChange={(e: any) =>
                                setCommentEdit(e.target.value)
                              }
                              placeholder="Edit this comment"
                            />
                            <ButtonAntd
                              onClick={SubmitE}
                              type="default"
                              content="Edit"
                            />
                          </div>
                        ) : (
                          <div>{r?.content}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex text-sm">
                      {r?.user._id === profile?._id && (
                        <>
                          <div
                            className="hover:text-blue-500 mx-2"
                            onClick={() => {
                              setEditId(r._id);
                              setCommentEdit(r.content);
                            }}
                          >
                            edit
                          </div>

                          <div
                            onClick={() => SubmitD(r._id)}
                            className="hover:text-red-500 mx-2"
                          >
                            delete
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

function convertToIndonesiaDateTime(isoString:string) {
  const options:any = {
      timeZone: 'Asia/Jakarta',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  };
  const date = new Date(isoString);
  return date.toLocaleString('en-US', options);
}

export default memo(CommentContainer);
