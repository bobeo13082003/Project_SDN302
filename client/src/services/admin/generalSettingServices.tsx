import axios from '../../utils/CustomizeApi';

export const generalSetting = () => {
    return axios.get('/general-setting')
}

export const editGeneralSetting = (email: string, nameApp: string, image: File) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('nameApp', nameApp);
    formData.append('image', image);
    return axios.post('/general-setting/edit', formData)
}