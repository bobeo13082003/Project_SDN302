import React, { useEffect, useState } from "react";
import { Flex, Input, Pagination, Spin } from "antd";
import "./slider.scss";
import CarouselAntd from "../../../components/CarouselAntd";
import { getBlog } from "../../../services/client/ApiServies";
import CardBlog from "../../../components/CardBlog";

export interface Blogs {
  id: string;
  title: string;
  author: string;
  image: string;
  content: string;
  like: number;
  slug: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const Explanations: React.FC = () => {
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getAllBlog = async () => {
    try {
      const res = await getBlog(currentPage);
      if (res.data && res.data.code === 200) {
        setBlogs(res.data.data);
        setTotalPage(res.data.totalPage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = async (e: number) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    getAllBlog();
  }, [currentPage]);

  return (
    <>
      {!blogs ? (
        <Flex align="center" gap="middle">
          <Spin size="large" />
        </Flex>
      ) : (
        <div className="explanation container">
          <div style={{ margin: "1%" }}>
            <CarouselAntd />
          </div>
          <div className="search">
            <Input
              className="mt-3 p-3"
              type="text"
              placeholder="Search for textbooks, ISBNs, questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="topic">
            <div className="row">
              {blogs &&
                blogs
                  .filter((blog) =>
                    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((blog, id) => <CardBlog key={id} blog={blog} />)}
            </div>
            <Pagination
              style={{ paddingBottom: "5%" }}
              onChange={(e) => handleChangePage(e)}
              current={currentPage}
              total={totalPage ? totalPage * 10 : 0}
              align="center"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Explanations;
