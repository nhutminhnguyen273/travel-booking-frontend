import { PaymentMethod, PaymentStatus } from './booking';

export interface Payment {
    booking: string;
    user: string;
    currency: string;
    paymentMethod: PaymentMethod;
    transactionId: string;
    paymentStatus: PaymentStatus;
    paidAt: Date;
    amount: number;
    amountInUSD?: number;
}

export interface PaymentRequest {
    bookingId: string;
    userId: string;
    amount: number;
    method: PaymentMethod;
}