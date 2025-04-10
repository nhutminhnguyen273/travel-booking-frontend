import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import MainLayout from '../../components/layout/MainLayout';

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

const ViewButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

interface Tour {
  id: number;
  name: string;
  image: string;
  price: string;
  location: string;
  duration: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading favorites from localStorage or API
    const loadFavorites = () => {
      const demoFavorites = [
        {
          id: 1,
          name: 'Tour Đà Lạt 3N2Đ',
          image: 'https://picsum.photos/id/1036/500/300',
          price: '3.000.000₫',
          location: 'Đà Lạt',
          duration: '3 ngày 2 đêm'
        },
        {
          id: 2,
          name: 'Tour Phú Quốc Nghỉ Dưỡng',
          image: 'https://picsum.photos/id/1043/500/300',
          price: '4.500.000₫',
          location: 'Phú Quốc',
          duration: '4 ngày 3 đêm'
        },
        // Add more demo favorites here
      ];

      setFavorites(demoFavorites);
      setLoading(false);
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (tourId: number) => {
    setFavorites(prev => prev.filter(tour => tour.id !== tourId));
  };

  if (loading) {
    return (
      <MainLayout>
        <PageWrapper>
          <Container>
            <Header>
              <Title>Đang tải...</Title>
            </Header>
          </Container>
        </PageWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageWrapper>
        <Container>
          <Header>
            <Title>Tour yêu thích</Title>
            <Subtitle>Danh sách các tour bạn đã lưu</Subtitle>
          </Header>

          {favorites.length === 0 ? (
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
              {favorites.map(tour => (
                <TourCard key={tour.id}>
                  <TourImage image={tour.image}>
                    <RemoveButton
                      onClick={() => handleRemoveFavorite(tour.id)}
                      title="Xóa khỏi yêu thích"
                    >
                      <FaTrash />
                    </RemoveButton>
                  </TourImage>
                  <TourContent>
                    <TourTitle to={`/tour/${tour.id}`}>
                      {tour.name}
                    </TourTitle>
                    <TourInfo>
                      <FaMapMarkerAlt />
                      {tour.location}
                    </TourInfo>
                    <TourInfo>
                      <FaCalendarAlt />
                      {tour.duration}
                    </TourInfo>
                    <TourPrice>
                      <span>{tour.price}</span>
                      <ViewButton to={`/tour/${tour.id}`}>
                        Chi tiết
                      </ViewButton>
                    </TourPrice>
                  </TourContent>
                </TourCard>
              ))}
            </TourGrid>
          )}
        </Container>
      </PageWrapper>
    </MainLayout>
  );
};

export default Favorites; 