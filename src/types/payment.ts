import { PaymentMethod, PaymentStatus } from './booking';

export interface Payment {
    _id: string;
    booking: string | null;
    user: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    transactionId: string;
    metadata: {
        clientSecret: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PaymentRequest {
    bookingId: string;
    userId: string;
    amount: number;
    method: PaymentMethod;
}