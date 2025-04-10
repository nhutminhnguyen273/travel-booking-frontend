import axiosInstance from '../config/axios';

export type PaymentMethod = 'vnpay' | 'momo';

export interface BookingData {
  tour: string;
  schedules: {
    startDate: string;
    endDate: string;
  }[];
  peopleCount: number;
  paymentMethod: PaymentMethod;
}

export interface Booking extends BookingData {
  _id: string;
  user: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const bookingService = {
    // Create a new booking
    createBooking: async (bookingData: BookingData) => {
        try {
            const response = await axiosInstance.post('/booking', bookingData);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Booking error response:', error.response.data);
                throw new Error(error.response.data.message || 'Lỗi khi đặt tour');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('Không nhận được phản hồi từ máy chủ');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                throw new Error('Lỗi khi gửi yêu cầu đặt tour');
            }
        }
    },

    // Get all bookings for a user
    getBookingsByUser: async (userId: string) => {
        const response = await axiosInstance.get(`/booking/user/${userId}`);
        return response.data;
    },

    // Get a single booking by ID
    getBookingById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/booking/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching booking:', error);
            throw error;
        }
    },

    // Update a booking
    updateBooking: async (id: string, bookingData: Partial<BookingData>) => {
        try {
            const response = await axiosInstance.put(`/booking/${id}`, bookingData);
            return response.data;
        } catch (error: any) {
            console.error('Error updating booking:', error);
            throw error;
        }
    },

    // Delete a booking
    deleteBooking: async (bookingId: string) => {
        const response = await axiosInstance.delete(`/booking/${bookingId}`);
        return response.data;
    },

    getBookings: async () => {
        try {
            const response = await axiosInstance.get('/booking/users');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    },

    confirmBooking: async (id: string) => {
        try {
            const response = await axiosInstance.put(`/booking/confirm/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error confirming booking:', error);
            throw error;
        }
    },

    cancelBooking: async (id: string) => {
        try {
            const response = await axiosInstance.put(`/booking/cancel/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error canceling booking:', error);
            throw error;
        }
    }
};

export default bookingService;
