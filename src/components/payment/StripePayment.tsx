import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import { BookingData, StripePaymentIntent } from '../../services/bookingService';
import tourService from '../../services/tourService';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key');

interface StripePaymentProps {
  bookingData: BookingData;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}

const PaymentContainer = styled.div`
  width: 100%;
  margin-top: ${props => props.theme.spacing.base};
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.base};
  background-color: #635bff;
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    background-color: #4b45c6;
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

const PaymentAmount = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const StripePayment: React.FC<StripePaymentProps> = ({ bookingData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tourPrice, setTourPrice] = useState<number>(0);

  useEffect(() => {
    const fetchTourPrice = async () => {
      try {
        const tour = await tourService.getTourById(bookingData.tour);
        setTourPrice(Number(tour.price));
      } catch (err) {
        console.error('Error fetching tour price:', err);
        setError('Không thể lấy thông tin giá tour');
      }
    };

    fetchTourPrice();
  }, [bookingData.tour]);

  const calculateTotalAmount = () => {
    const amount = Number(tourPrice) * Number(bookingData.peopleCount);
    return isNaN(amount) ? 0 : amount;
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const totalAmount = calculateTotalAmount();
      if (totalAmount <= 0) {
        throw new Error('Số tiền thanh toán không hợp lệ');
      }

      const paymentData = {
        ...bookingData,
        totalAmount: totalAmount,
        currency: 'vnd'
      };

      console.log('Payment data being sent:', JSON.stringify(paymentData, null, 2));

      // Create a payment intent on the server
      const response = await fetch('/api/booking/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment intent error:', errorData);
        throw new Error(errorData.message || 'Lỗi khi tạo thanh toán');
      }

      const paymentIntent: StripePaymentIntent = await response.json();
      console.log('Payment intent response:', paymentIntent);
      
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Không thể tải Stripe');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: paymentIntent.clientSecret,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Đã xảy ra lỗi khi thanh toán');
      onError(err.message || 'Đã xảy ra lỗi khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContainer>
      <PaymentAmount>
        Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalAmount())}
      </PaymentAmount>
      <PaymentButton 
        onClick={handlePayment} 
        disabled={loading || calculateTotalAmount() <= 0}
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán bằng Stripe'}
      </PaymentButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </PaymentContainer>
  );
};

export default StripePayment;
