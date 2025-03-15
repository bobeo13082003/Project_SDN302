import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Ads } from "../pages/admin/ads/AdsManage";
import { updateAds } from "../services/admin/adsServices";

interface PropModal {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  adsData: Ads | undefined;
  getAds: () => Promise<void>;
}

const ModalEditAds = ({
  isModalOpen,
  setIsModalOpen,
  adsData,
  getAds,
}: PropModal) => {
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Handle image file upload
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  // Set initial values from adsData when the modal is opened
  useEffect(() => {
    if (adsData) {
      setTitle(adsData.title);
      setLink(adsData.link);
      setPreviewImage(adsData.image);
    }
  }, [adsData]);

  const handleOk = async () => {
    try {
      if (!title) {
        toast.error("Title is required.");
        return;
      }

      if (!link) {
        toast.error("Link is required.");
        return;
      }

      if (!image) {
        toast.error("Image is required.");
        return;
      }

      // Call updateAds with the necessary parameters
      const res = await updateAds(adsData?._id || "", title, image, link);

      if (res.data && res.data.code === 200) {
        toast.success(res.data.message);
        setTitle("");
        setLink("");
        setPreviewImage("");
        setIsModalOpen(false);
        await getAds(); // Refresh ads after update
      } else {
        toast.error("Failed to update ad.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the ad.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        okText="Save"
        width={"70%"}
        title="Edit Ad"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form.Item label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label="Link">
          <TextArea
            value={link}
            onChange={(e) => setLink(e.target.value)}
            rows={4}
          />
        </Form.Item>

        <div>
          <label
            className="form-label label-upload btn btn-outline-success"
            htmlFor="labelUploadEdit"
          >
            <PlusOutlined /> Upload File IMAGE
          </label>
          <input
            type="file"
            hidden
            id="labelUploadEdit"
            accept="image/*"
            onChange={(event) => handleUploadImage(event)}
          />
          <div className="text-center my-2">
            {previewImage ? (
              <img
                className="p-2 rounded border border-2"
                width={200}
                src={previewImage}
                alt="Preview"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalEditAds;
