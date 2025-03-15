import React, { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userOtp } from '../../../services/client/ApiServies';
import { toast } from 'react-toastify';

const Otp = () => {
    const { email } = useParams()
    const [otp, setOtp] = useState<string>("");
    const navigate = useNavigate();
    const handleOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (email) {
                const res = await userOtp(email, otp)
                if (res && res.data?.code === 402) {
                    toast.error(res.data.message)
                    return;
                }
                if (res && res.data?.code === 200) {
                    navigate('/reset-password')
                }
            } else {
                toast.error("Email Not Empty")
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div>
            <div className='forgot container my-5'>
                <div className='forgot__header mt-3'>
                    <h1>Reset Your Password</h1>
                </div>
                <div className='forgot__content mt-3'>Enter the OTP in your Email</div>
                <form onSubmit={(e) => handleOtp(e)} className='forgot__form mt-3'>
                    <label htmlFor="email">Email</label>
                    <input disabled value={email} className='form-control' name='email' type='email' placeholder='Enter Your Email Address' />
                    <label htmlFor="otp">OTP</label>
                    <input onChange={(e) => setOtp(e.target.value)} className='form-control' name='otp' type='text' placeholder='Enter Your OTP' />
                    <button className='btn__forgot py-3 px-4 btn btn-primary mt-3'>Send</button>
                </form>
            </div>
        </div>
    );
};

export default Otp;