import { Modal } from 'antd';
import React from 'react';
import '../layout/layout.scss'
import {
    DeleteOutlined
} from "@ant-design/icons";
import { Notification } from '../pages/client/homeAuth/SliderBar';
import { deleteNotification, readNotification } from '../services/client/ApiServies';
import { useDispatch } from 'react-redux';
import { cancelNotif } from '../store/reducer/userReducer';
interface ModalProp {
    showNotification: boolean,
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
    notification: Notification[],
    getDataNotification: () => void,
}

const ModalNotification = ({ showNotification, setShowNotification, notification, getDataNotification }: ModalProp) => {
    const dispatch = useDispatch();
    const handleCancelNotification = async () => {
        try {
            const res = await readNotification();
            if (res.data && res.data.code === 200) {
                setShowNotification(false);
                await getDataNotification();
                dispatch(cancelNotif());
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteNotification = async (idNotification: string) => {
        try {
            const res = await deleteNotification(idNotification);
            if (res.data && res.data.code === 200) {
                await getDataNotification();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Modal
                mask={false}
                style={{ left: -240, top: 200, overflow: "scroll", maxHeight: 300 }}
                open={showNotification}
                onCancel={handleCancelNotification}
                footer={false}
            >
                {
                    notification && notification.length > 0 ?
                        <ul className='notification'>
                            {
                                notification.map((noti) =>
                                    <li key={noti._id}>
                                        <div className={noti.isRead ? "" : "not-read"}>
                                            <b>{noti.message}</b>
                                        </div>
                                        <DeleteOutlined onClick={() => handleDeleteNotification(noti._id)} style={{ color: "red", cursor: "pointer" }} />
                                    </li>
                                )
                            }
                        </ul>
                        :
                        <div className="text-center">
                            <h4>Not Have Notification</h4>
                        </div>
                }
            </Modal>
        </div>
    );
};

export default ModalNotification;