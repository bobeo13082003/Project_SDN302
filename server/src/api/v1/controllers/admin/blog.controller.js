const Blog = require("../../models/blog");
const slugify = require('slugify');
const Comment = require('../../models/comment'); // Model Comment




//[GET] api/v1/blog/allBlog
module.exports.getAllBlogs = async (req, res) => {
    const blogs = await Blog.find({
        deleted:false,
    }).sort({createdAt:'desc'});
    res.json({
        code:200,
        data:blogs
    });
}
// [POST] api/v1/blog/addBlog
module.exports.addBlog = async (req, res) => {
    try {
        const {title} = req.body;
        const slug = slugify(title, {
            lower: true,
            strict: true
        });
        const blog = new Blog({...req.body, slug});
        await blog.save()
        res.json({
            code:200,
            message: "Create Blog Successfully",
        });
    }catch (err){
        console.log(err)
    }
}
// [DELETE] api/v1/blog/deleteBlog
module.exports.deleteBlog = async (req, res) => {
    const { id } = req.body; // Lấy blog ID từ request body

    try {
        // Kiểm tra xem blog có tồn tại hay không
        const blog = await Blog.findOne({ _id: id });

        if (!blog) {
            return res.status(404).json({
                code: 404,
                message: "Blog not found",
            });
        }

        // Đánh dấu blog là đã xóa (deleted: true)
        await Blog.updateOne({ _id: id }, { deleted: true });

        // Xóa tất cả các comment liên quan đến blog
        await Comment.deleteMany({ blogId: id });

        res.status(200).json({
            code: 200,
            message: "Deleted Blog and its comments successfully",
        });
    } catch (error) {
        console.error('Error deleting blog and comments:', error.message);
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
        });
    }
};
// [PATCH] api/v1/blog/editBlog
module.exports.updateBlog = async (req, res) => {
    try {
        const {title} = req.body;
        const slug = slugify(title, {
            lower: true,
            strict: true
        });
        if(slug){
            await Blog.updateOne({slug:req.body.slug}, {...req.body, slug:slug});
            res.json({
                code:200,
                message: "Update Blog Successfully",
            });
        }
    }catch (err){
        console.log(err)
    }
}
