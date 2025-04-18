import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaStar, FaCheck } from 'react-icons/fa';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';
import { ErrorBoundary } from 'react-error-boundary';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`;

const TourDetailContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.base};
`;

const TourHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TourTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.base};
  color: ${({ theme }) => theme.colors.text};
`;

const TourLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TourRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  span {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: bold;
  }
  
  svg {
    color: #FFD700;
  }
`;

const TourImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TourGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TourContent = styled.div``;

const TourSidebar = styled.div``;

const TourDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TourInfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.base};
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 50px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ItineraryItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.base};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItineraryDay = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ItineraryTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ItineraryDescription = styled.p`
  line-height: 1.6;
`;

const IncludedItem = styled.li`
  position: relative;
  padding-left: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const IncludedList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    min-width: 18px;
  }
`;

const BookButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.base};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.base};
  color: ${({ theme }) => theme.colors.text};
`;

const ItineraryList = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TourPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => theme.spacing.base} 0;
`;

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
};

const TourDetailContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        setError('Invalid tour ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await tourService.getTourById(id);
        console.log('Tour details response:', response);
        
        if (response) {
          setTour(response);
        } else {
          setError('Tour not found');
        }
      } catch (err: any) {
        console.error('Error fetching tour:', err);
        setError(err.message || 'Failed to load tour details');
        toast.error('Không thể tải thông tin tour. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleBookNow = () => {
    if (!authService.isAuthenticated()) {
      toast.info('Vui lòng đăng nhập để đặt tour');
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <Wrapper>
        <TourDetailContainer>
          <PageTitle>Đang tải thông tin tour...</PageTitle>
        </TourDetailContainer>
      </Wrapper>
    );
  }

  if (error || !tour) {
    return (
      <Wrapper>
        <TourDetailContainer>
          <PageTitle>{error || 'Không tìm thấy tour'}</PageTitle>
        </TourDetailContainer>
      </Wrapper>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Wrapper>
      <TourDetailContainer>
        <TourHeader>
          <TourTitle>{tour.title}</TourTitle>
          
          <TourLocation>
            <FaMapMarkerAlt />
            <span>{tour.destination.join(', ')}</span>
          </TourLocation>
        </TourHeader>

        <TourImage 
          src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/800x400?text=No+Image'} 
          alt={tour.title} 
        />

        <TourGrid>
          <TourContent>
            <TourDescription>{tour.description}</TourDescription>

            <SectionTitle>Lịch trình tour</SectionTitle>
            <ItineraryList>
              {tour.itinerary && tour.itinerary.map((day, index) => (
                <ItineraryItem key={index}>
                  <ItineraryDay>Ngày {day.day}</ItineraryDay>
                  <ItineraryTitle>{day.title}</ItineraryTitle>
                  <ItineraryDescription>{day.description}</ItineraryDescription>
                </ItineraryItem>
              ))}
            </ItineraryList>

            <SectionTitle>Lịch khởi hành</SectionTitle>
            <ItineraryList>
              {tour.schedules && tour.schedules.map((schedule, index) => (
                <ItineraryItem key={index}>
                  <ItineraryTitle>Đợt {index + 1}</ItineraryTitle>
                  <ItineraryDescription>
                    Khởi hành: {formatDate(schedule.startDate.toString())}<br />
                    Kết thúc: {formatDate(schedule.endDate.toString())}
                  </ItineraryDescription>
                </ItineraryItem>
              ))}
            </ItineraryList>
          </TourContent>

          <TourSidebar>
            <TourInfoCard>
              <InfoItem>
                <FaCalendarAlt />
                <span>Thời gian: {tour.duration} ngày</span>
              </InfoItem>
              
              <InfoItem>
                <FaUsers />
                <span>Số người tối đa: {tour.maxPeople}</span>
              </InfoItem>
              
              <InfoItem>
                <FaUsers />
                <span>Còn lại: {tour.remainingSeats} chỗ</span>
              </InfoItem>
              
              <InfoItem>
                <FaMapMarkerAlt />
                <span>Loại tour: {tour.type === 'domestic' ? 'Trong nước' : 'Quốc tế'}</span>
              </InfoItem>
              
              <InfoItem>
                <FaCheck />
                <span>Trạng thái: {tour.status === 'available' ? 'Còn chỗ' : 'Hết chỗ'}</span>
              </InfoItem>
              
              <TourPrice>{formatPrice(tour.price)}</TourPrice>
              
              <BookButton 
                onClick={handleBookNow}
                disabled={tour.status !== 'available' || tour.remainingSeats <= 0}
              >
                {tour.status === 'available' && tour.remainingSeats > 0 
                  ? 'Đặt ngay' 
                  : 'Hết chỗ'}
              </BookButton>
            </TourInfoCard>
          </TourSidebar>
        </TourGrid>
      </TourDetailContainer>
    </Wrapper>
  );
};

const TourDetail: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TourDetailContent />
    </ErrorBoundary>
  );
};

export default TourDetail; 