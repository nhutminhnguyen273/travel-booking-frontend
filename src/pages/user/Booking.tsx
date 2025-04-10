import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';
import MainLayout from '../../components/layout/MainLayout';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';
import bookingService from '../../services/bookingService';
import { PaymentMethod } from '../../services/bookingService';

const PageWrapper = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: ${props => props.theme.maxWidth.content};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.base};
  font-family: ${props => props.theme.fonts.heading};
`;

const TourInfo = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const TourImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const TourDetails = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const BookingForm = styled.form`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.muted};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    people: 1,
    paymentMethod: 'vnpay' as PaymentMethod
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        if (!id) {
          throw new Error('Tour ID is required');
        }
        const data = await tourService.getTourById(id);
        setTour(data);
      } catch (err) {
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour || !id) return;

    try {
      if (!formData.startDate) {
        setError('Vui lòng chọn ngày khởi hành');
        return;
      }

      // Parse the start date
      const [year, month, day] = formData.startDate.split('-').map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        setError('Ngày khởi hành không hợp lệ');
        return;
      }

      const startDate = new Date(year, month - 1, day);
      if (isNaN(startDate.getTime())) {
        setError('Ngày khởi hành không hợp lệ');
        return;
      }

      // Calculate end date
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(tour.duration));
      
      if (isNaN(endDate.getTime())) {
        setError('Không thể tính ngày kết thúc');
        return;
      }

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      if (!formattedStartDate || !formattedEndDate) {
        setError('Không thể định dạng ngày');
        return;
      }

      const bookingData = {
        tour: id,
        schedules: [{
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }],
        peopleCount: formData.people,
        paymentMethod: formData.paymentMethod
      };

      console.log('Booking data being sent:', bookingData);
      console.log('Tour duration:', tour.duration);
      console.log('Start date:', formattedStartDate);
      console.log('End date:', formattedEndDate);

      const response = await bookingService.createBooking(bookingData);
      console.log('Booking response:', response);
      navigate('/bookings');
    } catch (err: any) {
      console.error('Detailed error:', err);
      setError(err.message || 'Không thể đặt tour. Vui lòng thử lại sau.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <MainLayout>
        <PageWrapper>
          <Container>
            <Title>Đang tải...</Title>
          </Container>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (error || !tour) {
    return (
      <MainLayout>
        <PageWrapper>
          <Container>
            <Title>Lỗi</Title>
            <p>{error}</p>
          </Container>
        </PageWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageWrapper>
        <Container>
          <TourInfo>
            <TourImage src={tour.image} alt={tour.name} />
            <Title>{tour.name}</Title>
            <TourDetails>
              <DetailItem>
                <FaMapMarkerAlt />
                <span>{tour.location}</span>
              </DetailItem>
              <DetailItem>
                <FaCalendarAlt />
                <span>{tour.duration} ngày</span>
              </DetailItem>
              <DetailItem>
                <FaUsers />
                <span>Số người tối đa: {tour.groupSize}</span>
              </DetailItem>
              <DetailItem>
                <FaMoneyBillWave />
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}</span>
              </DetailItem>
            </TourDetails>
            <p>{tour.description}</p>
          </TourInfo>

          <BookingForm onSubmit={handleSubmit}>
            <Title>Đặt tour</Title>
            <FormGroup>
              <Label>Ngày khởi hành</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>
            <FormGroup>
              <Label>Số người</Label>
              <Input
                type="number"
                name="people"
                value={formData.people}
                onChange={handleChange}
                min="1"
                max={tour.groupSize}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Phương thức thanh toán</Label>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
              </Select>
            </FormGroup>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitButton type="submit">Đặt tour</SubmitButton>
          </BookingForm>
        </Container>
      </PageWrapper>
    </MainLayout>
  );
};

export default Booking; 