import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import tourService from '../../services/tourService';
import { Tour } from '../../types/tour';
import bookingService, { PaymentMethod } from '../../services/bookingService';
import StripePayment from '../../components/payment/StripePayment';

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

const PaymentMethodContainer = styled.div`
  margin-top: ${props => props.theme.spacing.base};
`;

const PaymentMethodOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }

  &.selected {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
  }
`;

const PaymentMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.primary};
`;

const PaymentMethodLabel = styled.div`
  font-weight: 500;
`;

const PaymentMethodDescription = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.muted};
  margin-top: ${props => props.theme.spacing.xs};
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
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

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

      // Calculate total amount and ensure it's a number
      const totalAmount = Number(tour.price) * Number(formData.people);
      if (isNaN(totalAmount) || totalAmount <= 0) {
        setError('Số tiền thanh toán không hợp lệ');
        return;
      }

      const bookingData = {
        tour: id,
        schedules: [{
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }],
        peopleCount: Number(formData.people),
        paymentMethod: formData.paymentMethod,
        totalAmount: totalAmount,
        currency: 'vnd'
      };

      console.log('Booking data being sent:', JSON.stringify(bookingData, null, 2));
      console.log('Tour price:', tour.price);
      console.log('People count:', formData.people);
      console.log('Total amount:', totalAmount);

      // If payment method is Stripe, create a booking and show Stripe payment
      if (formData.paymentMethod === 'stripe') {
        try {
          const response = await bookingService.createBooking(bookingData);
          console.log('Booking response:', response);
          setBookingId(response.data._id);
          setShowStripePayment(true);
          return;
        } catch (err: any) {
          console.error('Stripe booking error:', err);
          setError(err.message || 'Lỗi khi tạo booking cho thanh toán Stripe');
          return;
        }
      }

      // For other payment methods, proceed with normal flow
      try {
        const response = await bookingService.createBooking(bookingData);
        console.log('Booking response:', response);

        // Show success message using a more reliable method
        if (window.confirm('Đặt tour thành công! Bạn có muốn xem danh sách tour không?')) {
          window.location.href = '/tours';
        }
      } catch (err: any) {
        console.error('Regular booking error:', err);
        setError(err.message || 'Không thể đặt tour. Vui lòng thử lại sau.');
      }
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

  const handleStripeSuccess = (_bookingId: string) => {
    // Navigate to tours page using the correct path
    window.location.href = '/tours';
  };

  const handleStripeError = (error: string) => {
    setError(error);
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <Title>Đang tải...</Title>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !tour) {
    return (
      <PageWrapper>
        <Container>
          <Title>Lỗi</Title>
          <p>{error}</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <TourInfo>
          <TourImage src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} alt={tour.title} />
          <Title>{tour.title}</Title>
          <TourDetails>
            <DetailItem>
              <FaMapMarkerAlt />
              <span>{tour.destination.join(', ')}</span>
            </DetailItem>
            <DetailItem>
              <FaCalendarAlt />
              <span>{tour.duration} ngày</span>
            </DetailItem>
            <DetailItem>
              <FaUsers />
              <span>Số người tối đa: {tour.maxPeople}</span>
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
              max={tour.maxPeople}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Phương thức thanh toán</Label>
            <PaymentMethodContainer>
              <PaymentMethodOption
                className={formData.paymentMethod === 'vnpay' ? 'selected' : ''}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'vnpay' }))}
              >
                <PaymentMethodIcon>
                  <FaMoneyBillWave />
                </PaymentMethodIcon>
                <div>
                  <PaymentMethodLabel>VNPay</PaymentMethodLabel>
                  <PaymentMethodDescription>Thanh toán qua cổng VNPay</PaymentMethodDescription>
                </div>
              </PaymentMethodOption>

              <PaymentMethodOption
                className={formData.paymentMethod === 'momo' ? 'selected' : ''}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'momo' }))}
              >
                <PaymentMethodIcon>
                  <FaMoneyBillWave />
                </PaymentMethodIcon>
                <div>
                  <PaymentMethodLabel>MoMo</PaymentMethodLabel>
                  <PaymentMethodDescription>Thanh toán qua ví MoMo</PaymentMethodDescription>
                </div>
              </PaymentMethodOption>

              <PaymentMethodOption
                className={formData.paymentMethod === 'stripe' ? 'selected' : ''}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'stripe' }))}
              >
                <PaymentMethodIcon>
                  <FaCreditCard />
                </PaymentMethodIcon>
                <div>
                  <PaymentMethodLabel>Stripe</PaymentMethodLabel>
                  <PaymentMethodDescription>Thanh toán bằng thẻ tín dụng/ghi nợ</PaymentMethodDescription>
                </div>
              </PaymentMethodOption>
            </PaymentMethodContainer>
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {showStripePayment && bookingId ? (
            <StripePayment
              bookingData={{
                tour: id!,
                schedules: [{
                  startDate: formData.startDate,
                  endDate: new Date(new Date(formData.startDate).getTime() + Number(tour.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }],
                peopleCount: formData.people,
                paymentMethod: 'stripe',
                totalAmount: Number(tour.price) * Number(formData.people)
              }}
              onSuccess={handleStripeSuccess}
              onError={handleStripeError}
            />
          ) : (
            <SubmitButton
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <a href="/tours" style={{ color: 'white', textDecoration: 'none' }}>Đặt tour</a>
            </SubmitButton>
          )}
        </BookingForm>
      </Container>
    </PageWrapper>
  );
};

export default Booking; 