import React, { useEffect, useState } from 'react';
import CardLibrary from '../../../components/CardLibrary';
import { getLabrary } from '../../../services/client/ApiServies';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface User {
    role: string;
    _id: string;
    email: string;
    userName: string;
    password: string;
    token: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface Quiz {
    _id: string;
    title: string;
    description?: string;
    userId: User;
    questions: string[];
    deleted: boolean;
    traffic: number;
    termCount: number; // Added termCount here
    createdAt: string;
    updatedAt: string;
}

export interface Labrary {
    _id: string;
    userId: string;
    quizId: Quiz[];
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

const UserLibrary = () => {
    const [library, setLibrary] = useState<Labrary>();
    const userId = useSelector((state: RootState) => state.user.user._id)

    const getAllLibrary = async () => {
        try {
            const res = await getLabrary(userId);
            if (res.data && res.data.code === 200) {
                const updatedLibrary: Labrary = {
                    ...res.data.data,
                    quizId: res.data.data.quizId.map((quiz: Quiz) => ({
                        ...quiz,
                        termCount: quiz.questions.length, // Calculate term count
                    })),
                };
                setLibrary(updatedLibrary);
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getAllLibrary()
    }, [userId])

    return (
        <div style={{ display: "inherit" }}>

            <div>
                {library && library.quizId.length > 0 ? (
                    <>
                        <CardLibrary getAllLibrary={getAllLibrary} library={library} />
                    </>
                ) : (
                    <h5>No Quizzes Added to Library</h5>
                )}
            </div>
        </div>
    );
};

export default UserLibrary;