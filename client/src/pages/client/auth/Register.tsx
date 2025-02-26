import { FormEvent, useState } from 'react';
import bn1 from '../../../assets/bn-1.png'
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../../../services/client/ApiServies';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { t } = useTranslation('signup');

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await userRegister(email.trim(), userName.trim(), password.trim());

            if (res.data && res.data.code === 402) {
                toast.error(res.data.message);
                return;
            }
            if (res && res.data.code === 200) {
                toast.success(res.data.message);
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='row'>
            <div className='banner-register col-lg-6'>
                <img src={bn1} />
                <h1>{t('the best way to study')}</h1>
            </div>
            <div className='register col-lg-6'>
                <div className='register__form'>
                    <h3>{t('signup')}</h3>
                    <form onSubmit={(e) => handleRegister(e)}>
                        <label className='mt-5' >Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className='form-control'
                            type="email"
                            value={email}
                            name='email'
                            placeholder={t('enter email')}
                        />
                        <label className='mt-3' >{t('user name')}</label>
                        <input
                            onChange={(e) => setUserName(e.target.value)}
                            className='form-control py-2'
                            type="text"
                            name='userName'
                            value={userName}
                            placeholder='Romeo999'
                        />
                        <label className='mt-3' >{t('password')}</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className='form-control py-2'
                            type="password"
                            value={password}
                            name='password'
                            placeholder={t('enter password')}
                        />
                        <button className='btn btn-primary form-control mt-3 py-3'>{t('signup')}</button>
                        <button onClick={() => navigate('/login')} className='btn btn-dark form-control mt-3 py-3'>{t('have an account')}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;