import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Blog } from '../pages/admin/blog/BlogManage';
import { updateBlog } from '../services/admin/blogServices';

interface PropModal {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    blogData: Blog | undefined,
    getBlogs: () => Promise<void>
}
const ModalEditBlog = ({ isModalOpen, setIsModalOpen, blogData, getBlogs }: PropModal) => {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState<string>("")

    const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setPreviewImage(URL.createObjectURL(file));
            setImage(file);
        }
    };

    useEffect(() => {
        if (blogData) {
            setTitle(blogData.title)
            setAuthor(blogData.author)
            setContent(blogData.content)
            setPreviewImage(blogData.image)
        }


    }, [blogData])

    const handleOk = async () => {
        try {
            if (!title) {
                toast.error("Title is required.");
                return;
            }

            if (!author) {
                toast.error("Author is required.");
                return;
            }

            if (!content) {
                toast.error("Content is required.");
                return;
            }

            if (!image) {
                toast.error("Image is required.");
                return;
            }
            const formattedContent = content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
            const res = await updateBlog(blogData?.slug || "", title, author, image, formattedContent);
            console.log(res.data);

            if (res.data && res.data.code === 200) {
                toast.success(res.data.message);
                setTitle("");
                setAuthor("");
                setContent("");
                setPreviewImage("");
                setIsModalOpen(false);
                await getBlogs();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <Modal okText="Save" width={"70%"} title="Edit Blog" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form.Item label="Title">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>
                <Form.Item label="Author">
                    <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
                </Form.Item>
                <Form.Item label="Content">
                    <TextArea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
                </Form.Item>
                <div>
                    <label className='form-label label-upload btn btn-outline-success' htmlFor='labelUploadEdit'> <PlusOutlined /> Upload File IMAGE</label>
                    <input
                        type='file'
                        hidden id='labelUploadEdit'
                        accept='image/*'
                        onChange={(event) => handleUploadImage(event)}
                    />
                    <div className='text-center my-2'>
                        {previewImage ?
                            <img className='p-2 rounded border border-2' width={200} src={previewImage} />
                            :
                            <></>
                        }
                    </div>
                </div>
                <Form.Item label="Like">
                    <Input placeholder='0' readOnly />
                </Form.Item>
            </Modal>
        </div >
    );
};

export default ModalEditBlog;