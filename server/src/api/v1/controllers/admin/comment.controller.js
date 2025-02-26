const Comment = require("../../models/comment.js");
const Users = require("../../models/user");

//[POST] api/v1/AllComment
module.exports.getAllComment = async (req, res) => {
  const { blogTitle, userName, content, createdAt, ...rest } = req.body;
  console.log(userName);
  let comments = await Comment.find({
    content: { $regex: content ?? "", $options: "i" },
    ...rest,
  })
    .populate([
      {
        path: "blogId",
        select: "_id title",
      },
      {
        path: "user",
        select: "_id userName",
      },
    ])
    .sort({ createdAt: "desc" });

  comments = comments.filter((c) => {
    return (
      c?.blogId?.title.includes(blogTitle ?? "") &&
      c?.user?.userName.includes(userName ?? "")
    );
  });

  if (createdAt) {
    comments = comments.filter((c) => {
      // console.log(c.createdAt.toISOString())
      var searchDate = new Date(createdAt)
      console.log('before cal',c.createdAt.toDateString())
      console.log(searchDate.toDateString())
      console.log(searchDate.toDateString() == c.createdAt.toDateString())
      console.log(c.content)
      return searchDate.toDateString() == c.createdAt.toDateString()
    });
  }
  res.json({
    code: 200,
    data: comments,
  });
};

//[DELETE] api/v1/comment/admin
module.exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const comment = await Comment.findOne({ _id: id });
  if (comment !== undefined && comment !== null) {
    await comment.deleteOne();

    res.json({
      code: 200,
      message: "delete Successfully",
    });
  } else {
    res.json({
      code: 500,
      message: "Comment not found",
    });
  }
};
