import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaShoppingCart } from 'react-icons/fa';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';
import { ErrorBoundary } from 'react-error-boundary';
import authService from '../../services/authService';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const ToursContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.base};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text};
`;

const FiltersContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const FilterGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const FilterLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 500;
  margin-top: ${props => props.theme.spacing.base};
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const TourCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const TourImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: ${props => props.theme.colors.surface};
`;

const TourContent = styled.div`
  padding: ${props => props.theme.spacing.base};
`;

const TourTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  a {
    text-decoration: none;
    color: ${props => props.theme.colors.text};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const TourInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.muted};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const TourDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  margin: ${props => props.theme.spacing.sm} 0;
  line-height: 1.5;
`;

const TourFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.sm};
  gap: ${props => props.theme.spacing.base};
`;

const TourRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.xs};
  
  span {
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    color: #FFD700;
  }
`;

const BookNowButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const TourPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ToursContent: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    duration: '',
    rating: ''
  });

  const fetchTours = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await tourService.getAllTours();
      console.log('API Response:', response);
      if (response.data && Array.isArray(response.data)) {
        setTours(response.data);
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Dữ liệu tour không hợp lệ');
        setTours([]);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    // TODO: Implement filtering logic with API
    console.log('Applying filters:', filters);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      duration: '',
      rating: ''
    });
  };

  const handleBookNow = (tourId: string) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${tourId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Wrapper>
        <ToursContainer>
          <PageTitle>Đang tải tour...</PageTitle>
        </ToursContainer>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <ToursContainer>
          <PageTitle>Lỗi</PageTitle>
          <p>{error}</p>
        </ToursContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ToursContainer>
        <PageTitle>Danh sách tour</PageTitle>
        
        <FiltersContainer>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Địa điểm</FilterLabel>
              <FilterSelect
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả địa điểm</option>
                {Array.from(new Set(tours.map(tour => tour.location))).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Thời gian</FilterLabel>
              <FilterSelect
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả thời gian</option>
                {Array.from(new Set(tours.map(tour => tour.duration))).map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Đánh giá</FilterLabel>
              <FilterSelect
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả đánh giá</option>
                <option value="4">4+ sao</option>
                <option value="3">3+ sao</option>
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
          
          <FilterButton onClick={handleFilter}>Áp dụng bộ lọc</FilterButton>
          <FilterButton onClick={resetFilters}>Đặt lại bộ lọc</FilterButton>
        </FiltersContainer>

        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>{error}</div>
        ) : tours.length === 0 ? (
          <div>Không có tour nào</div>
        ) : (
          <ToursGrid>
            {tours.map((tour) => (
              <TourCard key={tour._id}>
                <TourImage 
                  src={tour.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={tour.name}
                />
                <TourContent>
                  <TourTitle>
                    <Link to={`/tour/${tour._id}`}>{tour.name}</Link>
                  </TourTitle>
                  
                  <TourInfo>
                    <FaMapMarkerAlt />
                    <span>{tour.location}</span>
                  </TourInfo>
                  
                  <TourInfo>
                    <FaCalendarAlt />
                    <span>{tour.duration}</span>
                  </TourInfo>
                  
                  <TourDescription>{tour.description}</TourDescription>
                  
                  <TourFooter>
                    <div>
                      <TourPrice>{formatPrice(tour.price)}</TourPrice>
                      <TourRating>
                        <FaStar />
                        <span>{tour.rating}</span>
                      </TourRating>
                    </div>
                    <BookNowButton onClick={() => handleBookNow(tour._id)}>
                      <FaShoppingCart />
                      Đặt ngay
                    </BookNowButton>
                  </TourFooter>
                </TourContent>
              </TourCard>
            ))}
          </ToursGrid>
        )}
      </ToursContainer>
    </Wrapper>
  );
};

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <Wrapper>
      <ToursContainer>
        <PageTitle>Đã xảy ra lỗi</PageTitle>
        <p>{error.message}</p>
      </ToursContainer>
    </Wrapper>
  );
};

const Tours: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToursContent />
    </ErrorBoundary>
  );
};

export default Tours; 