export interface Payment {
    booking: string;
    user: string;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    paymentStatus: string;
    paidAt: Date
}