const Comment = require("../../models/comment.js");
const Users = require("../../models/user");
const Blog = require("../../models/blog");


//[POST] api/v1/comment
module.exports.postComment = async (req, res) => {
    const {content, blogId, commentId} = req.body;
    console.log(content, blogId)
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = await Users.findOne({
        token:token
    })

    if(user) {
        const comment = new Comment({
            content,
            blogId,
            user: user._id,
            commentId
        })
        
        await comment.save()

        if(commentId) {
            const fatherComment = await Comment.findById(commentId)
            if(fatherComment){
                fatherComment.replies = [...fatherComment.replies, comment._id]
                await fatherComment.save()
            }
        }

        if(blogId&&!commentId) {
            const blog = await Blog.findById(blogId)
            if(blog){

                blog.comments = [...blog.comments??[], comment._id]
                await blog.save()
            }
        }

        res.json({
            code:200,
            message: "Comment Successfully",
        })
    }else {
        res.json({
            code:500,
            message: "User not found",
        })
    }
}

//[DELETE] api/v1/comment
module.exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = await Users.findOne({
        token:token
    })

    if(user) {
        const comment = await Comment.findOne({_id: id, user: user._id})
        
        if(comment!==undefined&&comment!==null){
            await comment.deleteOne()

            res.json({
                code:200,
                message: "delete Successfully",
            })
        }else{
            res.json({
                code:500,
                message: "Comment not found",
            })
        }
    }else {
        res.json({
            code:500,
            message: "User not found",
        })
    }
}

//[PUT] api/v1/comment
module.exports.editComment = async (req, res) => {
    const {commentId, content} = req.body;
    
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = await Users.findOne({
        token:token
    })

    if(user) {
        const comment = await Comment.findOne({_id: commentId, user: user._id})
        if(comment!==undefined&&comment!==null){
            
            comment.content = content

            await comment.save()

            res.json({
                code:200,
                message: "edit Successfully",
            })
        }else{
            res.json({
                code:500,
                message: "Comment not found",
            })
        }
    }else {
        res.json({
            code:500,
            message: "User not found",
        })
    }
}