import axios from '../../utils/CustomizeApi';


export const adminLogin = async (userName: string, password: string) => {
    return await axios.post('auth/admin/login', { userName, password });
}