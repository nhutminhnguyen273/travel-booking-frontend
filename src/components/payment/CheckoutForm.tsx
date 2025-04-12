import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Form = styled.form`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const CardElementContainer = styled.div`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 10px;
  text-align: center;
`;

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Starting payment process...');

    if (!stripe || !elements) {
      console.error('Stripe or elements not ready');
      setError('Hệ thống thanh toán chưa sẵn sàng. Vui lòng thử lại sau.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('Confirming card payment...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      console.log('Payment result:', { stripeError, paymentIntent });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message || 'Có lỗi xảy ra trong quá trình thanh toán');
        onError(stripeError.message || 'Có lỗi xảy ra trong quá trình thanh toán');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, extracting booking ID...');
        // Extract booking ID from client secret
        const bookingId = clientSecret.split('_secret')[0];
        console.log('Booking ID:', bookingId);
        
        // Store the success state in localStorage
        localStorage.setItem('paymentSuccess', JSON.stringify({
          status: 'paid',
          bookingId: bookingId,
          timestamp: Date.now()
        }));

        console.log('Stored payment success in localStorage');

        // Call the success callback
        onSuccess(bookingId);
        console.log('Called onSuccess callback');

        // Use window.history.replaceState to update URL without reload
        window.history.replaceState(
          { status: 'paid', bookingId },
          '',
          '/payment-result'
        );
        console.log('Updated URL with replaceState');

        // Then navigate using React Router
        navigate('/payment-result', { 
          state: { 
            status: 'paid',
            bookingId: bookingId
          },
          replace: true
        });
        console.log('Navigated to payment result page');
      } else {
        console.error('Payment status:', paymentIntent.status);
        setError('Thanh toán không thành công. Vui lòng thử lại.');
        onError('Thanh toán không thành công. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Có lỗi xảy ra trong quá trình thanh toán');
      onError(err.message || 'Có lỗi xảy ra trong quá trình thanh toán');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <CardElementContainer>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </CardElementContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitButton type="submit" disabled={!stripe || processing}>
        {processing ? 'Đang xử lý...' : 'Thanh toán'}
      </SubmitButton>
    </Form>
  );
};

export default CheckoutForm; 