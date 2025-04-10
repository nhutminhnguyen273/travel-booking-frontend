import axiosInstance from '../config/axios';
import { Blog, CreateBlogData, UpdateBlogData } from '../types/blog';

const blogService = {
  // Get all blogs
  getAllBlogs: async (): Promise<{ message: string; data: Blog[] }> => {
    try {
      const response = await axiosInstance.get<{ message: string; data: Blog[] }>('/blogs');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
    }
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<Blog> => {
    try {
      const response = await axiosInstance.get<{ message: string; data: Blog }>(`/blogs/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch blog details');
    }
  },

  // Create new blog
  createBlog: async (data: FormData): Promise<Blog> => {
    const response = await axiosInstance.post('/blogs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update blog
  updateBlog: async (id: string, data: FormData): Promise<Blog> => {
    const response = await axiosInstance.put(`/blogs/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete blog (soft delete)
  deleteBlog: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete blog');
    }
  },

  // Increment view count
  incrementViewCount: async (id: string): Promise<Blog> => {
    try {
      const response = await axiosInstance.post<Blog>(`/blogs/${id}/increment-view`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to increment view count');
    }
  }
};

export default blogService; 