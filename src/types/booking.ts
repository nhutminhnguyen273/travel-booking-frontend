export enum PaymentMethod {
    STRIPE = 'stripe',
    VNPAY = 'vnpay',
    MOMO = 'momo'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    CANCELLED = 'cancelled'
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled'
}

export interface Booking {
    _id: string;
    user: string;
    tour: string;
    schedules: {
        startDate: string;
        endDate: string;
    }[];
    peopleCount: number;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    status: BookingStatus;
    totalAmount: number;
    totalPrice?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingData {
    tour: string;
    schedules: {
        startDate: string;
        endDate: string;
    }[];
    peopleCount: number;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    userId: string;
    currency: string;
    amountInUSD?: number;
}