import { LikeOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Blogs } from "../pages/client/homeAuth/BlogPage";

interface PropCardBlog {
  blog: Blogs;
}

const CardBlog = ({ blog }: PropCardBlog) => {
  const navigate = useNavigate();

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleViewBlog = (blog: string) => {
    navigate(`/blog/${blog}`);
  };

  return (
    <div className="col-6 mt-2 mb-5">
      <Card onClick={() => handleViewBlog(blog.slug)}>
        <Card.Meta
          className="d-flex"
          avatar={<Avatar shape="square" src={blog.image} size={100} />}
          description={
            <div>
              <h4>{blog.title}</h4>
              <p>{blog.author}</p>
              <p>
                <span>
                  <LikeOutlined />
                </span>{" "}
                {blog.like}
              </p>
              <div className="text-end">
                <p className="mb-0">{formatDate(blog.createdAt)}</p>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CardBlog;
