export enum TourType {
    DOMESTIC = 'domestic',
    INTERNATIONAL = 'international'
}

export enum StatusTour {
    Available = 'available',
    Unavailable = 'unavailable'
}

export interface Schedule {
    startDate: Date;
    endDate: Date;
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface Tour {
    _id: string;
    title: string;
    description: string;
    price: number;
    destination: string[];
    type: TourType;
    duration: number;
    schedules: Schedule[];
    maxPeople: number;
    remainingSeats: number;
    images: string[];
    itinerary: ItineraryDay[];
    status: StatusTour;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTourData extends Omit<Tour, '_id' | 'createdAt' | 'updatedAt'> {
    price: number;
    duration: number;
    maxPeople: number;
    remainingSeats: number;
}

export interface UpdateTourData extends Partial<CreateTourData> {}