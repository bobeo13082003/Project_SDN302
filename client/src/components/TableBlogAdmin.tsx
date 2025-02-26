import { Button, Image, Table } from 'antd';
import { Blog } from '../pages/admin/blog/BlogManage';
import { deleteBlog } from '../services/admin/blogServices';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ModalEditBlog from './ModalEditBlog';

interface PropTableBlog {
    blogs: Blog[],
    getBlogs: () => Promise<void>,
    searchKey: string
}

const TableBlogAdmin = ({ blogs, getBlogs, searchKey }: PropTableBlog) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [blogData, setBlogData] = useState<Blog>()

    const handleDelteteBlog = async (idBlog: string) => {
        try {
            const res = await deleteBlog(idBlog);
            if (res.data && res.data.code === 200) {
                toast.success(res.data.message)
                await getBlogs();
            } else {
                toast.error("Delete Blog Faile")
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleEditBlog = (blog: Blog) => {
        setBlogData(blog);
        setIsModalOpen(true)
    }
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image: string) => (
                <Image
                    width={70}
                    src={image}
                    alt="Blog Image"
                />
            ),
        },
        {
            title: 'Author',
            dataIndex: 'author'
        },
        {
            title: 'Like',
            dataIndex: 'like',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (_: any, blog: Blog) => (
                <>
                    <Button className="me-2" onClick={() => handleEditBlog(blog)} color='default'>
                        Edit
                    </Button>
                    <Button onClick={() => handleDelteteBlog(blog._id)} danger variant='solid'>
                        Delete
                    </Button>
                </>
            )
        },
    ];
    const dataSource = blogs
        .filter(blog => blog.title.toLowerCase().includes(searchKey.toLowerCase()))
        .map((blog, i) => ({
            key: i,
            _id: blog._id,
            slug: blog.slug,
            title: blog.title,
            image: blog.image,
            author: blog.author,
            like: blog.like,
            content: blog.content
        }));
    console.log(searchKey);

    return (
        <div>
            <Table columns={columns} dataSource={dataSource} />
            <ModalEditBlog getBlogs={getBlogs} blogData={blogData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
};

export default TableBlogAdmin;