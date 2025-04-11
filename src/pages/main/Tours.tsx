import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaShoppingCart, FaUsers, FaClock, FaTag, FaSearch, FaArrowRight, FaHeart } from 'react-icons/fa';
import tourService from '../../services/tourService';
import favoriteService from '../../services/favoriteService';
import { Tour } from '../../types/tour';
import { ErrorBoundary } from 'react-error-boundary';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { FavoriteTour, FavoriteResponse } from '../../services/favoriteService';

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

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  }
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

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const TourCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TourImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const TourImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TourContent = styled.div`
  padding: 1rem;
`;

const TourTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TourInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TourDescription = styled.p`
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const TourPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const BookNowButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  svg {
    font-size: 1rem;
  }
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  background: ${props => props.isFavorite ? props.theme.colors.error : 'transparent'};
  color: ${props => props.isFavorite ? 'white' : props.theme.colors.error};
  border: 1px solid ${props => props.isFavorite ? 'transparent' : props.theme.colors.error};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isFavorite ? props.theme.colors.error : props.theme.colors.error};
    color: white;
  }

  svg {
    font-size: 1rem;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
`;

const Input = styled.input`
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

interface FilterState {
  location: string;
  duration: string;
  type: string;
  minPrice: number;
  maxPrice: number;
}

interface Booking {
  tourId: string;
  price: number;
}

const calculateTotalPrice = (bookings: Booking[]): number => {
  return bookings.reduce((total, booking) => total + booking.price, 0);
};

const ToursContent: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    duration: 'all',
    type: 'all',
    minPrice: 0,
    maxPrice: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tourType, setTourType] = useState<'all' | 'domestic' | 'international'>('all');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await tourService.getAllTours();
        console.log('API Response:', response);
        setTours(response.data || []);
        console.log('Tours state after update:', response.data || []);
      } catch (err) {
        setError('Failed to load tours. Please try again later.');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await favoriteService.getFavorites() as FavoriteResponse;
          console.log('Favorites response:', response);
          if (response && response.data && Array.isArray(response.data)) {
            const favoriteIds = response.data.map(fav => fav.tour._id);
            console.log('Favorite IDs:', favoriteIds);
            setFavorites(favoriteIds);
          }
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchTours();
    fetchFavorites();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minPrice' || name === 'maxPrice' ? Number(value) : value
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      location: e.target.value
    }));
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.destination.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = tourType === 'all' || 
                       (tourType === 'domestic' && tour.type === 'domestic') ||
                       (tourType === 'international' && tour.type === 'international');

    return matchesSearch && matchesType;
  });

  console.log('Filtered Tours:', filteredTours);
  console.log('Current Filters:', filters);

  const handleBookNow = (tourId: string) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${tourId}`);
  };

  const handleBooking = (tourId: string) => {
    const selectedTour = tours.find(t => t._id === tourId);
    if (selectedTour) {
      const newBooking: Booking = {
        tourId: selectedTour._id,
        price: selectedTour.price
      };
      setBookings([...bookings, newBooking]);
    }
  };

  const handleFavorite = async (tourId: string) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      if (favorites.includes(tourId)) {
        await favoriteService.removeFavorite(tourId);
        setFavorites(prev => prev.filter(id => id !== tourId));
        toast.success('Đã xóa tour khỏi danh sách yêu thích');
      } else {
        await favoriteService.addFavorite(tourId);
        setFavorites(prev => [...prev, tourId]);
        toast.success('Đã thêm tour vào danh sách yêu thích');
      }
    } catch (err: any) {
      console.error('Error handling favorite:', err);
      toast.error(err.message || 'Không thể cập nhật danh sách yêu thích');
    }
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
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Tìm kiếm tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <FilterButtons>
            <FilterButton
              active={tourType === 'all'}
              onClick={() => setTourType('all')}
            >
              Tất cả
            </FilterButton>
            <FilterButton
              active={tourType === 'domestic'}
              onClick={() => setTourType('domestic')}
            >
              Tour trong nước
            </FilterButton>
            <FilterButton
              active={tourType === 'international'}
              onClick={() => setTourType('international')}
            >
              Tour nước ngoài
            </FilterButton>
          </FilterButtons>
        </FiltersContainer>

        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>{error}</div>
        ) : filteredTours.length === 0 ? (
          <div>
            <div>Không có tour nào phù hợp với bộ lọc. Hiển thị tất cả tour:</div>
            <ToursGrid>
              {tours.map((tour) => (
                <TourCard key={tour._id}>
                  <TourImageContainer>
                    <TourImage 
                      src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                      alt={tour.title}
                    />
                  </TourImageContainer>
                  <TourContent>
                    <TourTitle>
                      <Link to={`/tour/${tour._id}`}>{tour.title}</Link>
                    </TourTitle>
                    
                    <TourInfo>
                      <FaMapMarkerAlt />
                      <span>{tour.destination.join(', ')}</span>
                    </TourInfo>
                    
                    <TourInfo>
                      <FaClock />
                      <span>{tour.duration} ngày</span>
                    </TourInfo>
                    
                    <TourInfo>
                      <FaTag />
                      <span>{tour.type}</span>
                    </TourInfo>
                    
                    <TourDescription>{tour.description}</TourDescription>
                    
                    <TourFooter>
                      <div>
                        <TourPrice>{tour.price.toLocaleString()} VND</TourPrice>
                        <TourInfo>
                          <FaUsers />
                          <span>Còn {tour.remainingSeats}/{tour.maxPeople} chỗ</span>
                        </TourInfo>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <DetailButton to={`/tour/${tour._id}`}>
                          <FaArrowRight />
                          Chi tiết
                        </DetailButton>
                        <FavoriteButton
                          isFavorite={favorites.includes(tour._id)}
                          onClick={() => handleFavorite(tour._id)}
                          title={favorites.includes(tour._id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                        >
                          <FaHeart />
                          {favorites.includes(tour._id) ? "Đã thích" : "Thích"}
                        </FavoriteButton>
                        <BookNowButton onClick={() => handleBookNow(tour._id)}>
                          <FaShoppingCart />
                          Đặt ngay
                        </BookNowButton>
                      </div>
                    </TourFooter>
                  </TourContent>
                </TourCard>
              ))}
            </ToursGrid>
          </div>
        ) : (
          <ToursGrid>
            {filteredTours.map((tour) => (
              <TourCard key={tour._id}>
                <TourImageContainer>
                  <TourImage 
                    src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={tour.title}
                  />
                </TourImageContainer>
                <TourContent>
                  <TourTitle>
                    <Link to={`/tour/${tour._id}`}>{tour.title}</Link>
                  </TourTitle>
                  
                  <TourInfo>
                    <FaMapMarkerAlt />
                    <span>{tour.destination.join(', ')}</span>
                  </TourInfo>
                  
                  <TourInfo>
                    <FaClock />
                    <span>{tour.duration} ngày</span>
                  </TourInfo>
                  
                  <TourInfo>
                    <FaTag />
                    <span>{tour.type}</span>
                  </TourInfo>
                  
                  <TourDescription>{tour.description}</TourDescription>
                  
                  <TourFooter>
                    <div>
                      <TourPrice>{tour.price.toLocaleString()} VND</TourPrice>
                      <TourInfo>
                        <FaUsers />
                        <span>Còn {tour.remainingSeats}/{tour.maxPeople} chỗ</span>
                      </TourInfo>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <DetailButton to={`/tour/${tour._id}`}>
                        <FaArrowRight />
                        Chi tiết
                      </DetailButton>
                      <FavoriteButton
                        isFavorite={favorites.includes(tour._id)}
                        onClick={() => handleFavorite(tour._id)}
                        title={favorites.includes(tour._id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                      >
                        <FaHeart />
                        {favorites.includes(tour._id) ? "Đã thích" : "Thích"}
                      </FavoriteButton>
                      <BookNowButton onClick={() => handleBookNow(tour._id)}>
                        <FaShoppingCart />
                        Đặt ngay
                      </BookNowButton>
                    </div>
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