import React, { useState } from 'react';
import { Avatar, Card, Input } from 'antd';
import { Labrary } from '../pages/client/userLibrary/UserLibrary';
import { SearchOutlined } from '@ant-design/icons';
import '../layout/layout.scss'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
interface CardLibraryProps {
    library: Labrary; // Props to receive the library data
}

const CardLibrary = ({ library }: CardLibraryProps) => {
    const navigate = useNavigate();
      const { t } = useTranslation("learnquiz");
    const [search, setSearch] = useState<string>("");
    return (
        <div>
            <div className='d-flex justify-content-between'>
                <h2 className='text-primary'>Library</h2>
                <Input style={{ width: '300px' }} onChange={(e) => setSearch(e.target.value)} placeholder="Title" prefix={<SearchOutlined />} />
            </div>
            {library && library.quizId
                .filter((quiz) => quiz.title.toLowerCase().includes(search.toLowerCase()))
                .slice().reverse().map((quiz) =>
                    <Card onClick={() => navigate(`/quiz/quiz-details/${quiz._id}`)} key={quiz._id} className='fw-bold mt-5 card-library' size='small' title={
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Avatar>
                                {quiz.userId.userName.charAt(0).toUpperCase()}
                            </Avatar>
                            <span>{`${quiz.userId.userName} | ${quiz.termCount} ${t('Term')}`}</span>
                        </div>}>
                        <h3>{quiz.title}</h3>
                    </Card>
                )
            }
        </div>
    );
};

export default CardLibrary;