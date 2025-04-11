import axiosInstance from '../config/axios';
import { PaymentMethod, BookingData, BookingStatus, PaymentStatus } from '../types/booking';

export interface Booking extends BookingData {
  _id: string;
  user: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StripePaymentIntent {
  clientSecret: string;
  totalAmount: number;
  currency: string;
}

const bookingService = {
    // Create a new booking
    createBooking: async (bookingData: BookingData): Promise<any> => {
        try {
            // Ensure userId is included in the request
            if (!bookingData.userId) {
                throw new Error('User ID is required for booking');
            }

            console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2));
            const response = await axiosInstance.post('/booking', bookingData);
            return response.data;
        } catch (error: any) {
            console.error('Booking error response:', error.response?.data);
            
            // Handle specific error cases
            if (error.response?.data?.error?.includes('histories validation failed')) {
                throw new Error('Vui lòng đăng nhập lại để tiếp tục');
            }
            
            if (error.response?.data?.error?.includes('vượt quá giới hạn của Stripe')) {
                throw new Error(error.response.data.error);
            }
            
            throw new Error(error.response?.data?.message || 'Lỗi khi tạo booking');
        }
    },

    // Create a Stripe payment intent
    createStripePaymentIntent: async (bookingData: BookingData): Promise<StripePaymentIntent> => {
        try {
            const response = await axiosInstance.post('/booking/stripe/create-payment-intent', bookingData);
            return response.data;
        } catch (error: any) {
            console.error('Error creating Stripe payment intent:', error);
            throw new Error(error.response?.data?.message || 'Lỗi khi tạo thanh toán Stripe');
        }
    },

    // Confirm a Stripe payment
    confirmStripePayment: async (bookingId: string, paymentIntentId: string) => {
        try {
            const response = await axiosInstance.post('/booking/stripe/confirm', {
                bookingId,
                paymentIntentId
            });
            return response.data;
        } catch (error: any) {
            console.error('Error confirming Stripe payment:', error);
            throw new Error(error.response?.data?.message || 'Lỗi khi xác nhận thanh toán Stripe');
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
