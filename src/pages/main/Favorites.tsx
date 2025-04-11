import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaCalendarAlt, FaTrash, FaArrowRight } from 'react-icons/fa';
import favoriteService, { FavoriteTour } from '../../services/favoriteService';
import { toast } from 'react-toastify';

const PageWrapper = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: ${props => props.theme.maxWidth.content};
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.base};
  font-family: ${props => props.theme.fonts.heading};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.muted};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ExploreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const TourGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const TourCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform ${props => props.theme.animations.normal};

  &:hover {
    transform: translateY(-4px);
  }
`;

const TourImage = styled.div<{ image: string }>`
  height: 200px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.colors.error}dd;
  }
`;

const TourContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const TourTitle = styled(Link)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 600;
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TourInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const TourPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.base};
  
  span {
    font-size: ${props => props.theme.fontSizes.lg};
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }
`;

const TourFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
`;

const DetailButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

interface FavoriteResponse {
  message: string;
  data: FavoriteTour[];
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await favoriteService.getFavorites();
        console.log('Raw API Response:', response);
        
        if (response && response.data) {
          console.log('Response data:', response.data);
          // Filter out any invalid favorites
          const validFavorites = response.data.filter(fav => {
            console.log('Checking favorite:', fav);
            const isValid = Boolean(
              fav && 
              fav.tour && 
              fav.tour._id && 
              fav.tour.title && 
              typeof fav.tour.price === 'number'
            );
            console.log('Favorite tour data:', fav.tour);
            console.log('Is valid:', isValid);
            return isValid;
          });
          console.log('Valid favorites:', validFavorites);
          setFavorites(validFavorites);
        } else {
          console.log('No valid data in response');
          setFavorites([]);
        }
      } catch (err: any) {
        console.error('Error loading favorites:', err);
        setError(err.message || 'Không thể tải danh sách yêu thích');
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (tourId: string) => {
    try {
      await favoriteService.removeFavorite(tourId);
      setFavorites(prev => prev.filter(fav => fav.tour._id !== tourId));
      toast.success('Đã xóa tour khỏi danh sách yêu thích');
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      toast.error(err.message || 'Không thể xóa tour khỏi yêu thích');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>Tour yêu thích</Title>
          <Subtitle>Danh sách các tour bạn đã lưu</Subtitle>
        </Header>

        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>{error}</div>
        ) : favorites.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FaHeart />
            </EmptyStateIcon>
            <EmptyStateText>
              Bạn chưa có tour yêu thích nào
            </EmptyStateText>
            <ExploreButton to="/tours">
              Khám phá các tour
            </ExploreButton>
          </EmptyState>
        ) : (
          <TourGrid>
            {favorites.map(favorite => {
              console.log('Rendering favorite:', favorite);
              return (
                <TourCard key={favorite._id}>
                  <TourImage image={favorite.tour.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}>
                    <RemoveButton
                      onClick={() => handleRemoveFavorite(favorite.tour._id)}
                      title="Xóa khỏi yêu thích"
                    >
                      <FaTrash />
                    </RemoveButton>
                  </TourImage>
                  <TourContent>
                    <TourTitle to={`/tours/${favorite.tour._id}`}>
                      {favorite.tour.title || 'Không có tên tour'}
                    </TourTitle>
                    <TourInfo>
                      <FaMapMarkerAlt />
                      {favorite.tour.location || 'Không có địa điểm'}
                    </TourInfo>
                    <TourInfo>
                      <FaCalendarAlt />
                      {favorite.tour.duration || 'Không có thời gian'}
                    </TourInfo>
                    <TourFooter>
                      <TourPrice>
                        <span>{formatPrice(favorite.tour.price || 0)}</span>
                      </TourPrice>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <DetailButton to={`/tour/${favorite.tour._id}`}>
                          <FaArrowRight />
                          Chi tiết
                        </DetailButton>
                        <RemoveButton
                          onClick={() => handleRemoveFavorite(favorite.tour._id)}
                          title="Xóa khỏi yêu thích"
                        >
                          <FaTrash />
                        </RemoveButton>
                      </div>
                    </TourFooter>
                  </TourContent>
                </TourCard>
              );
            })}
          </TourGrid>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Favorites; 