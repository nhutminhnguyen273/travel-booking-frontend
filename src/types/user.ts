export interface User {
    _id: string;
    username: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    role: string;
    isDeleted: boolean;
    password?: string;
}