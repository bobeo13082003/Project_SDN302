import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { addNewAds } from '../services/admin/adsServices';
import { toast } from 'react-toastify';
import InputUploadImage from './InputUploadImage';

interface PropModal {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getAds: () => Promise<void>
}

const ModalCreateAds = ({ isModalOpen, setIsModalOpen, getAds }: PropModal) => {
    const [title, setTitle] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState<string>("")


    const handleOk = async () => {
        try {
            if (!title || !image || !link) {
                toast.error("Field cannot be empty.");
                return;
            }
        //    console.log(title, image, link);
           
            const res = await addNewAds(title, image, link);
            if (res.data && res.data.code === 200) {
                toast.success(res.data.message);
                handleCancel();
                await getAds();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setLink("");
        setPreviewImage("");
        setIsModalOpen(false);
    };
    return (
        <div>
            <Modal okText="Create" width={"70%"} title="Create New Blog" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form.Item label="Title">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>
              
                <Form.Item label="Link">
                    <TextArea value={link} onChange={(e) => setLink(e.target.value)} rows={4} />
                </Form.Item>
                <InputUploadImage previewImage={previewImage} setPreviewImage={setPreviewImage} setImage={setImage} />
              
            </Modal>
        </div>
    );
};

export default ModalCreateAds;