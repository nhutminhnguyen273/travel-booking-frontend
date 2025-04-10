import axiosInstance from '../config/axios';

const imageService = {
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/tours/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },

  uploadMultipleImages: async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('gallery', file);
      });

      const response = await axiosInstance.post('/tours/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading images:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    }
  },

  getImageUrl: (filename: string) => {
    return `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
  }
};

export default imageService; 