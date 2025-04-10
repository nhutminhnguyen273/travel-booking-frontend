import axiosInstance from '../config/axios';

export interface Voucher {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableTours: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  applicableTours?: string[];
}

export interface UpdateVoucherData extends Partial<CreateVoucherData> {
  isActive?: boolean;
  isDeleted?: boolean;
}

const voucherService = {
  getAllVouchers: async () => {
    const response = await axiosInstance.get('/vouchers');
    return response.data;
  },

  getVoucherById: async (id: string) => {
    const response = await axiosInstance.get(`/vouchers/${id}`);
    return response.data;
  },

  createVoucher: async (data: CreateVoucherData) => {
    const response = await axiosInstance.post('/vouchers', data);
    return response.data;
  },

  updateVoucher: async (id: string, data: UpdateVoucherData) => {
    const response = await axiosInstance.put(`/vouchers/${id}`, data);
    return response.data;
  },

  deleteVoucher: async (id: string) => {
    const response = await axiosInstance.delete(`/vouchers/${id}`);
    return response.data;
  },

  validateVoucher: async (code: string, totalAmount: number, tourId?: string) => {
    const response = await axiosInstance.post('/vouchers/validate', {
      code,
      totalAmount,
      tourId
    });
    return response.data;
  }
};

export default voucherService; 