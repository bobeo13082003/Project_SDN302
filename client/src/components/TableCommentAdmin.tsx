import { Button, Image, Table } from 'antd';
import { adminDeleteComment } from '../services/client/ApiComment';
import { toast } from 'react-toastify';




const TableCommentAdmin = ({ comments, afterAction=()=>{} }: any) => {

    const handleDelteteComment = async (commentId: string) => {
        await adminDeleteComment(commentId)
        await afterAction()
        toast.success("Delete comment successfully")
    }
    
    const columns = [
        {
            title: 'Blog Title',
            dataIndex: 'title',
            render: (_: any, comment:any) => <>
            <div>{comment?.blogId.title}</div>
            </>
        },
        {
            title: 'Content',
            dataIndex: 'content'
        },
        {
            title: 'Username',
            dataIndex: 'userName',
            render: (_: any, comment:any) => <>
            <div>{comment?.user?.userName}</div>
            </>
        },
        {
            title: 'CreatedDate',
            dataIndex: 'createdAt',
            render: (_: any, comment:any) => <>
            <div>{convertToIndonesiaDateTime(comment?.createdAt)}</div>
            </>
        },
        
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (_: any, comment:any) => (
                <>
                    
                    <Button onClick={() => handleDelteteComment(comment._id)} danger variant='solid'>
                        Delete
                    </Button>
                </>
            )
        },
    ];
    

    return (
        <div>
            <Table columns={columns} dataSource={comments} />
        </div>
    );
};

function convertToIndonesiaDateTime(isoString:string) {
    const options:any = {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const date = new Date(isoString);
    return date.toLocaleString('en-US', options);
}

export default TableCommentAdmin;