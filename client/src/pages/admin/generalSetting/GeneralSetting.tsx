import { Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import InputUploadImage from '../../../components/InputUploadImage';
import { editGeneralSetting, generalSetting } from '../../../services/admin/generalSettingServices';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { adminEditApp } from '../../../store/reducer/adminReducer';

const GeneralSetting = () => {
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [nameApp, setNameApp] = useState<string>("");
    const dispatch = useDispatch();
    const handleEdit = async () => {
        try {
            if (!email || !nameApp || !image) {
                toast.error("Field cannot be empty.");
                return;
            }
            const res = await editGeneralSetting(email, nameApp, image);
            if (res.data && res.data.code === 200) {
                toast.success(res.data.message);
                dispatch(adminEditApp({
                    email,
                    nameApp,
                    logo: previewImage
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getDataApp = async () => {
        try {
            const res = await generalSetting();
            if (res.data && res.data.code === 200) {
                setEmail(res.data.data.email)
                setNameApp(res.data.data.nameApp)
                setPreviewImage(res.data.data.image)
                dispatch(adminEditApp({ email: res.data.data.email, nameApp: res.data.data.nameApp, logo: res.data.data.image }))
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDataApp();
    }, [])

    return (
        <div>
            <Form.Item label="Email">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Name App">
                <Input value={nameApp} onChange={(e) => setNameApp(e.target.value)} />
            </Form.Item>
            <InputUploadImage previewImage={previewImage} setPreviewImage={setPreviewImage} setImage={setImage} />

            <Button onClick={handleEdit} size='large' >Save</Button>
        </div>
    );
};

export default GeneralSetting;