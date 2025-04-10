export interface Booking {
    _id: string;
    user: string;
    tour: string;
    schedules: [
        {
            startDate: string;
            endDate: string;
        }
    ];
    people: number;
    paymentStatus: string;
    paymentMethod: string;
    status: string;
}