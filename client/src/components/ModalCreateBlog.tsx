import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { addNewBlog } from '../services/admin/blogServices';
import { toast } from 'react-toastify';
import InputUploadImage from './InputUploadImage';

interface PropModal {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getBlogs: () => Promise<void>
}

const ModalCreateBlog = ({ isModalOpen, setIsModalOpen, getBlogs }: PropModal) => {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState<string>("")


    const handleOk = async () => {
        try {
            if (!title || !author || !image || !content) {
                toast.error("Field cannot be empty.");
                return;
            }

            const res = await addNewBlog(title, author, image, content);
            if (res.data && res.data.code === 200) {
                toast.success(res.data.message);
                handleCancel();
                await getBlogs();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setAuthor("");
        setContent("");
        setPreviewImage("");
        setIsModalOpen(false);
    };
    return (
        <div>
            <Modal okText="Create" width={"70%"} title="Create New Blog" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form.Item label="Title">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>
                <Form.Item label="Author">
                    <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
                </Form.Item>
                <Form.Item label="Content">
                    <TextArea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
                </Form.Item>
                <InputUploadImage previewImage={previewImage} setPreviewImage={setPreviewImage} setImage={setImage} />
                <Form.Item label="Like">
                    <Input placeholder='0' readOnly />
                </Form.Item>
            </Modal>
        </div>
    );
};

export default ModalCreateBlog;