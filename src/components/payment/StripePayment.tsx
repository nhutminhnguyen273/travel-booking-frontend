import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { BookingData } from '../../types/booking';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface StripePaymentProps {
  bookingData: BookingData & { bookingId: string };
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ bookingData, onSuccess, onError }) => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('Initializing Stripe...');
        // Load Stripe
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
        if (!stripe) {
          throw new Error('Không thể khởi tạo Stripe. Vui lòng thử lại sau.');
        }
        setStripePromise(stripe);
        console.log('Stripe initialized successfully');

        // Create payment intent
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Vui lòng đăng nhập để tiếp tục');
        }

        console.log('Creating payment intent...');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            bookingId: bookingData.bookingId,
            amount: bookingData.totalAmount,
            method: 'stripe',
            currency: 'vnd'
          })
        });

        console.log('Payment intent response:', response);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể tạo thanh toán. Vui lòng thử lại sau.');
        }

        const data = await response.json();
        console.log('Payment intent data:', data);

        if (!data.data?.clientSecret) {
          throw new Error('Không thể tạo thanh toán. Vui lòng thử lại sau.');
        }

        setClientSecret(data.data.clientSecret);
        console.log('Client secret set successfully');
      } catch (error: any) {
        console.error('Error initializing Stripe:', error);
        onError(error.message || 'Lỗi khi khởi tạo thanh toán Stripe');
      }
    };

    initializeStripe();
  }, [bookingData, onError]);

  const handleSuccess = async (bookingId: string) => {
    try {
      console.log('Handling payment success...');
      // Call the success callback
      onSuccess(bookingId);
      console.log('Success callback called');
    } catch (error) {
      console.error('Error handling success:', error);
      onError('Có lỗi xảy ra khi xử lý thanh toán thành công');
    }
  };

  const handleError = (error: any) => {
    console.error('Payment error:', error);
    onError(error.message || 'Có lỗi xảy ra trong quá trình thanh toán');
  };

  if (!stripePromise || !clientSecret) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm 
        clientSecret={clientSecret}
        onSuccess={() => handleSuccess(bookingData.bookingId)} 
        onError={handleError}
      />
    </Elements>
  );
};

export default StripePayment;