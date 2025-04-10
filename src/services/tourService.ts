import axiosInstance from '../config/axios';
import { Tour } from '../types/tour';

interface ImageFiles {
  image?: File;
  gallery?: File[];
}

const tourService = {
    // Get all tours
    getAllTours: async (): Promise<{ message: string; data: Tour[] }> => {
        try {
            const response = await axiosInstance.get<{ message: string; data: Tour[] }>('/tours');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch tours');
        }
    },

    // Get tour by ID
    getTourById: async (id: string): Promise<Tour> => {
        try {
            const response = await axiosInstance.get<{ message: string; data: Tour }>(`/tours/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch tour details');
        }
    },

    // Create new tour
    createTour: async (tour: Omit<Tour, '_id'>, imageFiles?: ImageFiles): Promise<Tour> => {
        try {
            const response = await axiosInstance.post<Tour>('/tours', tour, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create tour');
        }
    },

    // Update tour
    updateTour: async (id: string, tour: Partial<Tour>, imageFiles?: ImageFiles): Promise<Tour> => {
        try {
            const formData = new FormData();
            
            // Append tour data as JSON string
            formData.append('data', JSON.stringify(tour));
            
            // Append image files if provided
            if (imageFiles?.image) {
                formData.append('image', imageFiles.image);
            }
            
            if (imageFiles?.gallery && imageFiles.gallery.length > 0) {
                imageFiles.gallery.forEach((file) => {
                    formData.append('gallery', file);
                });
            }

            const response = await axiosInstance.put<Tour>(`/tours/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update tour');
        }
    },

    // Delete tour (soft delete)
    deleteTour: async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/tours/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete tour');
        }
    }
};

export default tourService;

