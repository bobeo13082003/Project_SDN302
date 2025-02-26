// src/services/admin/userServices.ts
import axios from '../../utils/CustomizeApi';
import { User } from '../../types/user';

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get('/admin/getUsers');
    return response.data;
};

// Update an existing user
export const updateUser = async (
    _id: string,
    userName: string,
    email: string,
    role: 'admin' | 'user',
    status: 'active' | 'inactive'
): Promise<User> => {
    const response = await axios.put(`/admin/updateUser/${_id}`, { userName, email, role, status });
    return response.data;
};

// Delete a user
export const deleteUser = async (_id: string): Promise<void> => {
    await axios.delete(`/admin/deleteUser/${_id}`);
};

// Update user status
export const updateUserStatus = async (
    _id: string,
    status: 'active' | 'inactive'
): Promise<User> => {
    const response = await axios.patch('/admin/updateStatus', { _id, status });
    return response.data;
};
