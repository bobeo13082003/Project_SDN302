
import './auth.scss'
import bn1 from '../../../assets/bn-1.png'
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../../../services/client/ApiServies';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { doLogin } from '../../../store/reducer/userReducer';
import { useTranslation } from 'react-i18next';
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('signin');
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);


    const handleLogin = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();

        try {
            console.log(password);

            const res = await userLogin(email.trim(), password.trim());

            if (res && res.data.code === 402) {
                toast.error(res.data.message);
                return;
            }
            if (res && res.data.code === 200) {
                toast.success(res.data.message);
                dispatch(doLogin({ _id: res.data.id, token: res.data.token }));
                navigate('/');
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='row' style={{ marginTop: "40px" }}>
            <div className='banner-login col-lg-6'>
                <img src={bn1} />
                <h1>{t('dress casually study seriously')}</h1>
            </div>
            <div className='login col-lg-6'>
                <div className='login__form'>
                    <h3>{t('sign in')}</h3>
                    <form onSubmit={(e) => handleLogin(e)}>
                        <label className='mt-5' htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className='form-control py-2'
                            type="email"
                            name='email'
                            placeholder={t('enter email')}
                        />
                        <label className='forgot__password d-flex justify-content-between mt-3' htmlFor="password">{t('password')} <span><Link to={'/forgot-password'} >{t('forgot pasword')}</Link></span></label>
                        <div className='password__input'>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className='form-control py-2'
                                type={showPassword ? "text" : "password"}
                                name='password'
                                placeholder={t('enter password')}
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className='icon-eyes text-dark'><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /></span>
                        </div>
                        <button className='btn btn-primary form-control mt-3 py-3'> {t('sign in')}</button>
                        <button onClick={() => navigate('/register')} className='btn btn-dark form-control mt-3 py-3'>{t('new use quizlet')}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;