import axiosInstance from '../config/axios';

export interface FavoriteTour {
  _id: string;
  user: string;
  tour: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    location: string;
    duration: string;
  };
}

export interface FavoriteResponse {
  message: string;
  data: FavoriteTour[];
}

const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

const favoriteService = {
  getFavorites: async (): Promise<FavoriteResponse> => {
    try {
      const response = await axiosInstance.get('/favorites', {
        timeout: TIMEOUT
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      return { message: 'Error', data: [] };
    }
  },

  addFavorite: async (tourId: string): Promise<void> => {
    try {
      await axiosInstance.post('/favorites', { tourId }, {
        timeout: TIMEOUT
      });
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      throw new Error(error.response?.data?.message || 'Không thể thêm tour vào yêu thích');
    }
  },

  removeFavorite: async (tourId: string): Promise<void> => {
    let retryCount = 0;
    let lastError: any = null;

    while (retryCount < MAX_RETRIES) {
      try {
        const response = await axiosInstance.delete(`/favorites/${tourId}`, {
          timeout: TIMEOUT
        });
        console.log('Remove favorite response:', response);
        
        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || 'Không thể xóa tour khỏi yêu thích');
        }
        return; // Success, exit the function
      } catch (error: any) {
        console.error(`Error removing favorite (attempt ${retryCount + 1}):`, error);
        lastError = error;
        
        if (error.code === 'ECONNABORTED') {
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying... (${retryCount}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            continue;
          }
        }
        
        if (error.response) {
          throw new Error(error.response.data?.message || 'Không thể xóa tour khỏi yêu thích');
        } else if (error.request) {
          throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.');
        } else {
          throw new Error('Đã xảy ra lỗi khi xóa tour khỏi yêu thích');
        }
      }
    }

    // If we've exhausted all retries
    throw new Error('Không thể xóa tour khỏi yêu thích sau nhiều lần thử. Vui lòng thử lại sau.');
  }
};

export default favoriteService; 