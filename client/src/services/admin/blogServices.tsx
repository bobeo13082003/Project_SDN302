import axios from '../../utils/CustomizeApi';


export const getAllBlog = async () => {
    return axios.get('blog/allBlog');
}

export const addNewBlog = async (title: string, author: string, image: File, content: string) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('image', image);
    formData.append('content', content);
    return axios.post('blog/addBlog', formData)
}

export const deleteBlog = async (id: string) => {
    return axios.delete('blog/deleteBlog', {
        data: { id }
    })
}

export const updateBlog = async (slug: string, title: string, author: string, image: File, content: string) => {
    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('image', image);
    formData.append('content', content);
    return axios.patch('blog/editBlog', formData)
}