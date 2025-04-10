export interface Booking {
    _id: string;
    user: string;
    tour: string;
    schedules: {
        startDate: string;
        endDate: string;
    }[];
    peopleCount: number;
    paymentStatus: string;
    paymentMethod: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}