import axiosInstance from '../config/axios';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const contactService = {
  getAllContacts: async () => {
    const response = await axiosInstance.get('/contacts');
    return response.data;
  },

  getContactById: async (id: string) => {
    const response = await axiosInstance.get(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (data: CreateContactData) => {
    const response = await axiosInstance.post('/contacts', data);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await axiosInstance.put(`/contacts/${id}/read`);
    return response.data;
  },

  deleteContact: async (id: string) => {
    const response = await axiosInstance.delete(`/contacts/${id}`);
    return response.data;
  },

  updateContactStatus: async (id: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    const response = await axiosInstance.patch(`/contacts/${id}/status`, { status });
    return response.data;
  }
};

export default contactService; 