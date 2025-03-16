import React, { useState } from 'react';
import { Avatar, Button, Card, Dropdown, Input, Menu, Popconfirm } from 'antd';
import { Labrary } from '../pages/client/userLibrary/UserLibrary';
import { DeleteOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import '../layout/layout.scss'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { deleteQuizLibrary } from '../services/client/ApiServies';
import { toast } from 'react-toastify';
interface CardLibraryProps {
    library: Labrary; // Props to receive the library data
    getAllLibrary: () => void;
}

const CardLibrary = ({ library, getAllLibrary }: CardLibraryProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation("learnquiz");
    const [search, setSearch] = useState<string>("");
    const handleDeleteQuiz = async (quizId: string) => {
        try {
            const res = await deleteQuizLibrary(quizId);
            if (res && res.data.code === 200) {
                toast.success("Delete Quiz Library Successfully")
                getAllLibrary();
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div>
            <div className='d-flex justify-content-between'>
                <h2 className='text-primary'>Library</h2>
                <Input style={{ width: '300px' }} onChange={(e) => setSearch(e.target.value)} placeholder="Title" prefix={<SearchOutlined />} />
            </div>
            {library && library.quizId
                .filter((quiz) => quiz.title.toLowerCase().includes(search.toLowerCase()))
                .slice().reverse().map((quiz) =>
                    <>

                        <Card key={quiz._id} className='fw-bold mt-5 card-library' size='small' title={
                            <div>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="delete" icon={<DeleteOutlined />}>
                                                <Popconfirm
                                                    title="Are you sure you want to delete this quiz?"
                                                    onConfirm={() => handleDeleteQuiz(quiz._id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <span onClick={(e) => e.stopPropagation()}>
                                                        {t("DeleteQuiz")}
                                                    </span>
                                                </Popconfirm>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={["click"]}
                                >
                                    <Button
                                        icon={<MoreOutlined />}
                                        className="more-button"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Dropdown>
                                <div onClick={() => navigate(`/quiz/quiz-details/${quiz._id}`)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Avatar>
                                        {quiz.userId.userName.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <span>{`${quiz.userId.userName} | ${quiz.termCount} ${t('Term')}`}</span>
                                </div>
                            </div>

                        }>
                            <h3>{quiz.title}</h3>
                        </Card>
                    </>
                )
            }
        </div>
    );
};

export default CardLibrary;