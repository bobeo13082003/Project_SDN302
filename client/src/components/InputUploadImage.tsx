import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

interface PropInputUploadImage {
    setImage: React.Dispatch<React.SetStateAction<File | undefined>>,
    previewImage: string,
    setPreviewImage: React.Dispatch<React.SetStateAction<string>>
}

const InputUploadImage = ({ setImage, previewImage, setPreviewImage }: PropInputUploadImage) => {

    const handelUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setPreviewImage(URL.createObjectURL(file));
            setImage(file);
        }
    };
    return (
        <div>
            <label className='form-label label-upload btn btn-outline-success' htmlFor='labelUpload'> <PlusOutlined /> Upload File IMAGE</label>
            <input
                type='file'
                hidden id='labelUpload'
                accept='image/*'
                onChange={(event) => handelUploadImage(event)}
            />
            <div className='text-center my-2'>
                {previewImage ?
                    <img className='p-2 rounded border border-2' width={200} src={previewImage} />
                    :
                    <></>
                }
            </div>
        </div>
    );
};

export default InputUploadImage;