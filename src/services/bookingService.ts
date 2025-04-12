import axiosInstance from '../config/axios';
import { PaymentMethod, BookingData, BookingStatus, PaymentStatus, Booking } from '../types/booking';

export interface StripePaymentIntent {
  clientSecret: string;
  totalAmount: number;
  currency: string;
}

export interface UpdateBookingStatus {
  status: BookingStatus;
}

export interface UpdatePaymentStatus {
  paymentStatus: PaymentStatus;
}

const bookingService = {
    // Create a new booking
    createBooking: async (bookingData: BookingData): Promise<any> => {
        try {
            // Ensure userId is included in the request
            if (!bookingData.userId) {
                throw new Error('User ID is required for booking');
            }

            // Ensure payment method is included
            if (!bookingData.paymentMethod) {
                throw new Error('Payment method is required');
            }

            console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2));
            const response = await axiosInstance.post('/booking', {
                ...bookingData,
                paymentMethod: 'stripe' // Force payment method to be 'stripe'
            });
            
            console.log('Booking response:', response.data);
            
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response from server');
            }
            
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
    updateBooking: async (id: string, data: Partial<Booking>) => {
        try {
            const response = await axiosInstance.put(`/booking/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating booking:', error);
            throw error;
        }
    },

    // Delete a booking
    deleteBooking: async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/booking/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    },

    // Update booking status
    updateBookingStatus: async (id: string, status: BookingStatus) => {
        try {
            const response = await axiosInstance.put(`/booking/${id}/status`, { status });
            return response.data;
        } catch (error: any) {
            console.error('Error updating booking status:', error);
            throw error;
        }
    },

    // Update payment status
    updatePaymentStatus: async (id: string, paymentStatus: PaymentStatus) => {
        try {
            const response = await axiosInstance.put(`/booking/${id}/payment-status`, { paymentStatus });
            return response.data;
        } catch (error: any) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    },

    // Get all bookings
    getAllBookings: async (): Promise<{ message: string; data: Booking[] }> => {
        try {
            const response = await axiosInstance.get<{ message: string; data: Booking[] }>('/booking');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching all bookings:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đặt tour');
        }
    }
};

export default bookingService;
