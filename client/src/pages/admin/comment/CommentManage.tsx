import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Input } from "antd";
import TableBlogAdmin from "../../../components/TableBlogAdmin";
import { useEffect, useState } from "react";
import ModalCreateBlog from "../../../components/ModalCreateBlog";
import { getAllBlog } from "../../../services/admin/blogServices";
import { getAllComment } from "../../../services/client/ApiComment";
import TableCommentAdmin from "../../../components/TableCommentAdmin";
export interface Blog {
  _id: string;
  title: string;
  image: string;
  author: string;
  like: number;
  slug: string;
  content: string;
}
const CommentManage = () => {
  const [comments, setComments] = useState<any>();
  const [filter, setFilter] = useState<any>({});
  const getComments = async () => {
    try {
      const res = await getAllComment(filter);
      if (res.data && res.data.code === 200) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <div>
        <h2>Comments Manage</h2>
      </div>
      <Divider />
      <div>
        <div className="d-flex gap-5">
          <Input
            onChange={(e: any) =>
              setFilter({ ...filter, blogTitle: e.target.value })
            }
            value={filter?.blogTitle}
            size="large"
            placeholder="Blog title"
            prefix={<SearchOutlined />}
          />

          <Input
            onChange={(e: any) =>
              setFilter({ ...filter, content: e.target.value })
            }
            value={filter?.content}
            size="large"
            placeholder="Comment content"
            prefix={<SearchOutlined />}
          />
          <Input
            onChange={(e: any) =>
              setFilter({ ...filter, userName: e.target.value })
            }
            value={filter?.userName}
            size="large"
            placeholder="Username"
            prefix={<SearchOutlined />}
          />

          <Button
            onClick={getComments}
            type="primary"
            icon={<SearchOutlined />}
            size="large"
          >
            Filter
          </Button>
          <Button
            onClick={async() => {
              setFilter({})
            }}
            type="primary"
            icon={<SearchOutlined />}
            size="large"
          >
            Reset
          </Button>
        </div>
        <div>
          <DatePicker
            onChange={(value) =>{
              console.log(value)
              setFilter({ ...filter, createdAt: value })
            }}
            value={filter?.createdAt}
            size="large"
            placeholder="Created Date"
          />
        </div>
      </div>
      <div className="mt-2">
        <TableCommentAdmin afterAction={getComments} comments={comments} />
      </div>
    </div>
  );
};

export default CommentManage;
