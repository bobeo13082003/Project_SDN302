import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Divider, Input } from 'antd'
import TableBlogAdmin from '../../../components/TableBlogAdmin'
import { useEffect, useState } from 'react';
import ModalCreateBlog from '../../../components/ModalCreateBlog';
import { getAllBlog } from '../../../services/admin/blogServices';
export interface Blog {
  _id: string,
  title: string,
  image: string,
  author: string,
  like: number,
  slug: string,
  content: string
}
const BlogManage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const getBlogs = async () => {
    try {
      const res = await getAllBlog();
      if (res.data && res.data.code === 200) {
        setBlogs(res.data.data)
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getBlogs();
  }, [])
  const handleCreateBlog = () => {
    setIsModalOpen(true);
  }


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  }


  return (
    <div>
      <div>
        <h2>Blogs Management</h2>
      </div>
      <Divider />
      <div>
        <div className='d-flex gap-5'>
          <Button onClick={handleCreateBlog} type="primary" icon={<PlusCircleOutlined />} size="large">
            Add New Blog
          </Button>
          <Input onChange={(e) => handleSearch(e)} size="large" placeholder="Titel Blog" prefix={<SearchOutlined />} />
        </div>
        <ModalCreateBlog getBlogs={getBlogs} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
      <div className='mt-2'>
        <TableBlogAdmin searchKey={searchKey} getBlogs={getBlogs} blogs={blogs} />
      </div>
    </div>
  )
}

export default BlogManage