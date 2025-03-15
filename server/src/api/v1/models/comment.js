const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    content: String,
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      //required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      //required: true,
    },
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      //required: true,
    },

    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        //required: true,
      },
    ],

    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
