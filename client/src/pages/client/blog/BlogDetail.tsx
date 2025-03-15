import { LikeFilled, LikeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Flex, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { detailBlog, getNotification, likeBlog } from '../../../services/client/ApiServies';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Notification } from '../homeAuth/SliderBar';
import { doLike } from '../../../store/reducer/userReducer';
import CommentContainer from './CommentContainer';



interface BlogDetail {
    _id: string,
    title: string,
    author: string,
    image: string,
    content: string,
    like: number,
    slug: string,
    likeBy: Array<string>,
    deleted: boolean,
    createdAt: string,
    updatedAt: string,
    comments?: any[],

}

const BlogDetail = () => {
    const { slugBlog } = useParams<{ slugBlog: string }>();
    const [viewDetailBlog, setViewDetailBlog] = useState<BlogDetail | null>(null);
    const [like, setLike] = useState<boolean>(false);
    const userId = useSelector((state: RootState) => state.user.user._id);
    const dispatch = useDispatch();

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const updateNotificationCount = async () => {
        try {
            const res = await getNotification();
            if (res.data && res.data.code === 200) {
                const unreadNotifications = res.data.data.filter(
                    (notif: Notification) => !notif.isRead
                );
                dispatch(doLike(unreadNotifications.length))
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (slugBlog) {
            getBlogDetail();
        } else {
            console.log("Slug Not Found");
        }
    }, [slugBlog])

    if (!slugBlog) {
        return;
    }

    const getBlogDetail = async () => {
        try {
            const res = await detailBlog(slugBlog);
            if (res.data && res.data.code === 200) {
                setViewDetailBlog(res.data.data);
                setLike(res.data.data.likeBy.includes(userId));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = async (like: boolean, idBlog: string) => {
        const newLikeStatus = !like;
        setLike(newLikeStatus);
        try {
            await likeBlog(idBlog, newLikeStatus);
            setViewDetailBlog((prev) =>
                prev ? {
                    ...prev,
                    likeBy: newLikeStatus
                        ? [...prev.likeBy, userId]
                        : prev.likeBy.filter(id => id !== userId)
                } : null
            );
            await updateNotificationCount();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            {
                viewDetailBlog ? (
                    <div className='container blog'>
                        <div className='blog__title'>
                            <h1>{viewDetailBlog.title}</h1>
                        </div>
                        <div>
                            <hr className='border border-2' />
                            <div className='d-flex justify-content-between fs-5 align-items-center'>
                                <div>
                                    <Avatar className='me-2 bg-white text-bg-light ' size={50} icon={<UserOutlined />} />
                                    <span>{viewDetailBlog.author}</span>
                                </div>
                                <div>
                                    <b>Updated:{formatDate(viewDetailBlog.updatedAt)}</b>
                                    <p>Published:{formatDate(viewDetailBlog.createdAt)}</p>
                                </div>
                            </div>
                            <hr className='border border-2' />
                        </div>
                        <div className='fs-5 '>
                            <p>
                                {viewDetailBlog.content}
                            </p>
                        </div>
                        <div style={{ cursor: "pointer" }} className='text-end fs-5'>
                            <p className='d-inline' onClick={() => handleLike(like, viewDetailBlog._id)}><span>{like ? <LikeFilled /> : <LikeOutlined />}</span>Like</p>
                        </div>
                        <CommentContainer blogId={viewDetailBlog._id}         comments={viewDetailBlog?.comments || []}
afterComment={getBlogDetail}/>
                    </div>

                ) : (
                    <Flex className='d-flex justify-content-center' style={{ height: "100vh", width: "100%" }} align="center" gap="middle">
                        <Spin size="large" />
                    </Flex>
                )
            }
        </>

    );
};

export default BlogDetail;