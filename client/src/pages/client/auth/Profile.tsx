import { Card, Divider, Modal } from "antd";
import { useEffect, useState } from "react";
import { editProfile, userProfile } from "../../../services/client/ApiServies";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProfileTwoTone } from "@ant-design/icons";

interface Profile {
    email: string,
    userName: string
}
const Profile = () => {
    const [profile, setProfile] = useState<Profile>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [newUserName, setNewUserName] = useState<string>('');
    const getProfile = async () => {
        try {
            const res = await userProfile()
            if (res.data && res.data.code === 401) {
                navigate('/');
            } else {
                if (res.data && res.data.code === 200) {
                    setProfile(res.data.user);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setNewUserName('');
        setIsModalOpen(false);
    };
    useEffect(() => {
        getProfile()
        console.log(profile);
    }, []);

    const handleEditProfile = async () => {
        try {
            const res = await editProfile(newUserName);
            if (!newUserName) {
                toast.error("User Name Not Empty");
                return;
            }
            if (res.data && res.data.code === 200) {
                toast.success(res.data.message)
                handleCancel();
                await getProfile();
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="d-flex justify-content-center card-profile">
            <Card title="Personal information" bordered={true} style={{ width: "50%" }}>
                <div className="d-flex justify-content-between">
                    <div>
                        <b className="fs-6">UserName:</b>
                        <p>{profile?.userName}</p>
                    </div>
                    <button onClick={showModal} className="btn btn-outline-primary border-0 fw-bold">Edit</button>
                </div>
                <Divider />
                <b className="fs-6">Email:</b>
                <p>{profile?.email}</p>
                <Divider />
            </Card>
            <Modal okText="Save" title="Basic Modal" open={isModalOpen} onOk={handleEditProfile} onCancel={handleCancel}>
                <label htmlFor="userName">UserName:</label>
                <input onChange={(e) => setNewUserName(e.target.value)} className="form-control" name="userName" value={newUserName} />
            </Modal>
        </div>
    );
};

export default Profile;