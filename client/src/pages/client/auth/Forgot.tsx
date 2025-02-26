import React, { FormEvent, useState } from 'react';
import { userForgot } from '../../../services/client/ApiServies';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();
    const handelSendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await userForgot(email);

            if (!email) {
                return toast.error("Please Enter Your Email")
            }
            if (res && res.data.code === 402) {
                return toast.error(res.data.message)
            }
            if (res && res.data.code === 200) {
                navigate(`/otp/${res.data.email}`);
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div className='forgot container my-5'>
            <div className='forgot__header mt-3'>
                <h1>Reset Your Password</h1>
            </div>
            <div className='forgot__content mt-3'>Enter the email you signed up with. We'll send you a OTP to log in and reset your password.</div>
            <form onSubmit={(e) => handelSendEmail(e)} className='forgot__form mt-3'>
                <label htmlFor="email">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} className='form-control' name='email' type='email' placeholder='Enter Your Email Address' />
                <button className='btn__forgot py-3 px-4 btn btn-primary mt-3'>Send</button>
            </form>
        </div>
    );
};

export default Forgot;