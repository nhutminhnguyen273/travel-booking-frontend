import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { BookingData, PaymentMethod } from '../../types/booking';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import styled from 'styled-components';

// Initialize Stripe with retry logic
const initializeStripe = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        return stripe;
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Failed to initialize Stripe after multiple attempts');
};

const stripePromise = initializeStripe().catch(error => {
  console.error('Error loading Stripe:', error);
  return null;
});

interface StripePaymentProps {
  bookingData: BookingData;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm = styled.form`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorText = styled.div`
  color: #dc3545;
  text-align: center;
  padding: 20px;
`;

const SuccessText = styled.div`
  color: #28a745;
  text-align: center;
  padding: 20px;
`;

const CheckoutForm = ({ clientSecret, bookingData, onSuccess, onError }: { 
  clientSecret: string;
  bookingData: BookingData;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const paymentIntent = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      
      if (paymentIntent && paymentIntentClientSecret) {
        try {
          const result = await stripe?.retrievePaymentIntent(paymentIntentClientSecret);
          console.log('Payment result:', result);
          
          if (result?.paymentIntent?.status === 'succeeded') {
            toast.success('Thanh toán thành công!');
            onSuccess(bookingData.tour);
            navigate('/payment/success', { 
              state: { 
                bookingId: bookingData.tour,
                amount: bookingData.totalAmount 
              } 
            });
          } else {
            toast.error('Thanh toán thất bại. Vui lòng thử lại.');
            navigate('/payment/failure', { 
              state: { 
                error: result?.error?.message || 'Thanh toán thất bại' 
              } 
            });
          }
        } catch (error: any) {
          console.error('Error checking payment status:', error);
          toast.error('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán');
        }
      }
    };

    checkPaymentStatus();
  }, [searchParams, stripe, navigate, bookingData, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe is not initialized');
      return;
    }

    setLoading(true);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/result?bookingId=${bookingData.tour}`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed');
      toast.error(error.message || 'Payment failed');
      navigate('/payment/failure', { 
        state: { 
          error: error.message || 'Thanh toán thất bại' 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentForm onSubmit={handleSubmit}>
      <PaymentElement />
      <SubmitButton type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay with Stripe'}
      </SubmitButton>
    </PaymentForm>
  );
};

const StripePayment: React.FC<StripePaymentProps> = ({ bookingData, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        console.log('Sending payment data:', { bookingId: bookingData.tour, amount: bookingData.totalAmount });

        const response = await paymentService.createPayment({
          bookingId: bookingData.tour,
          userId: bookingData.userId,
          amount: bookingData.totalAmount,
          method: PaymentMethod.STRIPE
        });

        console.log('Payment response:', response);

        if (!response.data?.clientSecret) {
          throw new Error('Không nhận được clientSecret từ server');
        }

        setClientSecret(response.data.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment:', error);
        setError(error.message || 'Có lỗi xảy ra khi tạo thanh toán');
        onError(error.message || 'Có lỗi xảy ra khi tạo thanh toán');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [bookingData, onError]);

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (!clientSecret) {
    return <LoadingText>Loading payment form...</LoadingText>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm 
        clientSecret={clientSecret}
        bookingData={bookingData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;
