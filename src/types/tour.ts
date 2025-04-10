export interface Tour {
    _id: string;
    name: string;
    description: string;
    image: string;
    gallery: string[];
    price: number;
    duration: string;
    location: string;
    groupSize: number;
    remainingSeats: number;
    rating: number;
    includes: string[];
    excludes: string[];
    itinerary: {
        day: string;
        title: string;
        description: string;
    }[];
    isDeleted: boolean;
}