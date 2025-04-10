import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaStar, FaCheck } from 'react-icons/fa';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';

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

const TourDetail: React.FC = () => {
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
        const data = await tourService.getTourById(id);
        setTour(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tour details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Wrapper>
          <TourDetailContainer>
            <PageTitle>Loading tour details...</PageTitle>
          </TourDetailContainer>
        </Wrapper>
      </MainLayout>
    );
  }

  if (error || !tour) {
    return (
      <MainLayout>
        <Wrapper>
          <TourDetailContainer>
            <PageTitle>{error || 'Tour not found'}</PageTitle>
          </TourDetailContainer>
        </Wrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Wrapper>
        <TourDetailContainer>
          <TourHeader>
            <TourTitle>{tour.name}</TourTitle>
            
            <TourLocation>
              <FaMapMarkerAlt />
              <span>{tour.location}</span>
            </TourLocation>
            
            <TourRating>
              <FaStar />
              <span>{tour.rating}</span>
            </TourRating>
          </TourHeader>

          <TourImage src={tour.image} alt={tour.name} />

          <TourGrid>
            <TourContent>
              <TourDescription>{tour.description}</TourDescription>

              <SectionTitle>Tour Itinerary</SectionTitle>
              <ItineraryList>
                {tour.itinerary.map((day, index) => (
                  <ItineraryItem key={index}>
                    <ItineraryDay>{day.day}</ItineraryDay>
                    <ItineraryTitle>{day.title}</ItineraryTitle>
                    <ItineraryDescription>{day.description}</ItineraryDescription>
                  </ItineraryItem>
                ))}
              </ItineraryList>

              <SectionTitle>What's Included</SectionTitle>
              <IncludedList>
                {tour.includes.map((item, index) => (
                  <IncludedItem key={index}>
                    <FaCheck />
                    <span>{item}</span>
                  </IncludedItem>
                ))}
              </IncludedList>
            </TourContent>

            <TourSidebar>
              <TourInfoCard>
                <InfoItem>
                  <FaCalendarAlt />
                  <span>Duration: {tour.duration}</span>
                </InfoItem>
                
                <InfoItem>
                  <FaUsers />
                  <span>Group Size: {tour.groupSize}</span>
                </InfoItem>
                
                <InfoItem>
                  <FaUsers />
                  <span>Remaining Seats: {tour.remainingSeats}</span>
                </InfoItem>
                
                <BookButton onClick={() => navigate(`/booking/${tour._id}`)}>
                  Book Now
                </BookButton>
              </TourInfoCard>
            </TourSidebar>
          </TourGrid>
        </TourDetailContainer>
      </Wrapper>
    </MainLayout>
  );
};

export default TourDetail; 