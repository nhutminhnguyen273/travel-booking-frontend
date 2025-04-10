import { User } from './user';

export interface Login {
    username: string;
    password: string;
}

export interface Register {
    username: string;
    fullName: string;
    dateOfBirth: string | Date;
    gender: string;
    email: string;
    phone: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    accessToken: string;
    user: User;
    success?: boolean;
}