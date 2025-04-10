import axiosInstance from '../config/axios';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone: string;
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
  }
};

export default contactService; 