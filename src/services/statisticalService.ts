import axiosInstance from '../config/axios';

export interface StatisticalData {
  _id: string;
  date: string;
  totalBookings: number;
  totalRevenue: number;
  confirmedRevenue: number;
  totalUsers: number;
  totalTours: number;
  paymentMethods: {
    VNPay: number;
    MoMo: number;
    Stripe: number;
  };
  bookingStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  revenueByTour: Array<{
    tour: string;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: number;
    year: number;
    revenue: number;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const statisticalService = {
  getDailyStatistics: async () => {
    const response = await axiosInstance.get('/statistical/daily');
    return response.data;
  },

  getStatisticsByDateRange: async (startDate: string, endDate: string) => {
    const response = await axiosInstance.get('/statistical/range', {
      params: { startDate, endDate }
    });
    return response.data;
  }
};

export default statisticalService; 