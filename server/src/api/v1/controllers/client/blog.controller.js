const Blog = require("../../models/blog");
const Users = require("../../models/user");
const Notification = require("../../models/notification");
const paginatinHelper = require('../../../../helper/pagination')

// [GET] api/v1/blog/getBlog
module.exports.allBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.countDocuments({ deleted: false })
        const objectPagination = paginatinHelper(
            {
                currentPage: 1,
                limit: 4
            },
            allBlogs,
            req.query)
        const blogs = await Blog.find({
            deleted: false
        })
            .limit(objectPagination.limit)
            .skip(objectPagination.skip)
            .sort({ createdAt: "desc" })

        res.json({
            code: 200,
            data: blogs,
            totalPage: objectPagination.totalPage,
        })
    } catch (err) {
        console.error(err);
    }
}



// [GET] api/v1/blog/detailBlog
module.exports.detailBlog = async (req, res) => {
    const { slug } = req.query;
    const blogDetail = await Blog.findOne({
        slug: slug,
        deleted: false
    }).populate({
        path: 'comments',
        select: 'content createdAt',
        populate: [
            {
                path: 'user',
                select: 'userName'
            },
            {
                path: 'replies',
                select: 'content createdAt',
                populate: {
                    path: 'user',
                    select: 'userName',
                }
            }
        ]
    })
    if (!blogDetail) {
        return res.json({
            code: 402,
            message: "Not Found Blog"
        })
    } else {
        res.json({
            code: 200,
            data: blogDetail
        })
    }
}

//[POST] api/v1/blog/like
module.exports.likeBlog = async (req, res) => {
    const { idBlog, like } = req.body;
    const blog = await Blog.findOne({
        _id: idBlog,
        deleted: false
    })
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const user = await Users.findOne({
        token: token
    })

    if (user) {
        const userExits = blog.likeBy.includes(user.id)
        if (like === true) {
            if (!userExits) {
                const newLike = blog.like + 1;
                await Blog.updateOne({ _id: idBlog }, {
                    like: newLike,
                    $push: { likeBy: user.id }
                })
                const message = `Cảm ơn bạn đã quan tâm đến bài viết ${blog.title}. Hãy tiếp tục theo dõi để không bỏ lỡ nội dung mới nhé!`
                const objNotification = {
                    userId: user._id,
                    message: message,
                }
                const notification = new Notification(objNotification)
                await notification.save()
            }
        } else if (like === false) {
            if (userExits) {
                const newLike = blog.like - 1;
                await Blog.updateOne({ _id: idBlog }, {
                    like: newLike,
                    $pull: { likeBy: user.id }
                })
            }
        }
        res.json({
            code: 200,
            message: "Like Successfully",
        })
    } else {
        res.json(error)
    }
}

/////////
// [GET] /api/v1/blog/getLikedBlogs
module.exports.getLikedBlogs = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ code: 400, message: "User ID is required" });
        }

        const likedBlogs = await Blog.find({
            likeBy: { $in: [userId] },
            deleted: false,
        }).select("title author createdAt like");

        res.status(200).json({
            code: 200,
            data: likedBlogs,
        });
    } catch (error) {
        console.error("Failed to fetch liked blogs:", error);
        res.status(500).json({
            code: 500,
            message: "Internal server error",
        });
    }
};

// [GET] api/v1/blog/getLikedBlogsCount

//
module.exports.getLikedBlogsCount = async (req, res) => {
    try {
        const { userId } = req.query; // Lấy user ID từ header


        if (!userId) {
            console.error("User ID is missing in request");
            return res
                .status(400)
                .json({ code: 400, message: "User ID is required" });
        }

        const likedBlogCount = await Blog.countDocuments({
            likeBy: { $in: [userId] },
            deleted: false,
        });
        res.status(200).json({
            code: 200,
            count: likedBlogCount,
        });
    } catch (error) {
        console.error("Error in getLikedBlogsCount:", error);
        res.status(500).json({ code: 500, message: "Internal server error" });
    }
};

