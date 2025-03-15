export interface User {
    _id: string;
    userName: string;
    password: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: Date;
    status: 'active' | 'inactive';
}
