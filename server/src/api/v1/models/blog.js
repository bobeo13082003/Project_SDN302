const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
        title: String,
    
        author: String,
        image: String,
        content: String,
        slug: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        like:{
            type: Number,
            default:0
        },
        likeBy:{
            type:Array,
            default:[]
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    })

const Blog = mongoose.model('Blog', blogSchema, 'blog');

module.exports = Blog;