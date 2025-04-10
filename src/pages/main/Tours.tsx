import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaShoppingCart, FaUsers, FaClock, FaTag, FaSearch, FaArrowRight } from 'react-icons/fa';
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

const TourImage = styled.img`
  width: 100%;
  height: 200px;
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

    fetchTours();
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
    const matchesLocation = filters.location === 'all' || tour.destination.includes(filters.location);
    const matchesDuration = filters.duration === 'all' || tour.duration === parseInt(filters.duration);
    const matchesType = filters.type === 'all' || tour.type === filters.type;
    const matchesPrice = (!filters.minPrice || tour.price >= filters.minPrice) && 
                        (!filters.maxPrice || tour.price <= filters.maxPrice);
    
    return matchesLocation && matchesDuration && matchesType && matchesPrice;
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
                <option value="all">All Locations</option>
                {Array.from(new Set(tours.flatMap(tour => tour.destination))).map(location => (
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
                  <option key={duration} value={duration}>{duration} ngày</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Loại tour</FilterLabel>
              <FilterSelect
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả loại tour</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="relaxation">Relaxation</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Giá</FilterLabel>
              <PriceRange>
                <Input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice || ''}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                />
                <Input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice || ''}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                />
              </PriceRange>
            </FilterGroup>
          </FilterGrid>
          
          <FilterButton onClick={() => {
            // TODO: Implement filtering logic with API
            console.log('Applying filters:', filters);
          }}>Áp dụng bộ lọc</FilterButton>
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
                  <TourImage 
                    src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={tour.title}
                  />
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
                      <BookNowButton onClick={() => handleBookNow(tour._id)}>
                        <FaShoppingCart />
                        Đặt ngay
                      </BookNowButton>
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
                <TourImage 
                  src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={tour.title}
                />
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