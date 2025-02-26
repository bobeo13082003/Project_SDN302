import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { userResetPassword } from '../../../services/client/ApiServies';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await userResetPassword(newPassword.trim(), confirmPassword.trim());
            console.log(newPassword, confirmPassword);

            if (res && res.data?.code === 402) {
                return toast.error(res.data.message)
            }
            if (res && res.data?.code === 200) {
                toast.success(res.data.message);
            }
            navigate('/login')
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
                <form onSubmit={(e) => handleResetPassword(e)} className='forgot__form mt-3'>
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => setNewPassword(e.target.value)} className='form-control' name='password' type='password' placeholder='Enter Your Password' />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input onChange={(e) => setConfirmPassword(e.target.value)} className='form-control' name='confirmPassword' type='password' placeholder='Confirm Your Password' />
                    <button className='btn__forgot py-3 px-4 btn btn-primary mt-3'>Reset</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;