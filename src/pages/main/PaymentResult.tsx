import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ResultCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const IconWrapper = styled.div<{ success: boolean }>`
  font-size: 4rem;
  color: ${props => props.success ? '#4CAF50' : '#f44336'};
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BackButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const HomeButton = styled(Button)`
  background-color: #667eea;
  color: white;

  &:hover {
    background-color: #764ba2;
  }
`;

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // Get state from location
  const state = location.state as { status?: string; bookingId?: string } | null;
  
  // Check localStorage for payment success
  const paymentSuccess = localStorage.getItem('paymentSuccess');
  const paymentData = paymentSuccess ? JSON.parse(paymentSuccess) : null;
  
  useEffect(() => {
    // Clear the payment success data from localStorage
    if (paymentSuccess) {
      localStorage.removeItem('paymentSuccess');
    }

    // Determine success status and booking ID
    const success = state?.status === 'paid' || paymentData?.status === 'paid';
    const id = state?.bookingId || paymentData?.bookingId;

    if (!success && !id) {
      navigate('/', { replace: true });
      return;
    }

    setIsSuccess(success);
    setBookingId(id);

    if (success) {
      toast.success('Thanh toán thành công!');
    } else {
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
    }
  }, [state, paymentData, navigate, paymentSuccess]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/', { replace: true });
  };

  if (isSuccess === null) return null;

  return (
    <ResultContainer>
      <ResultCard>
        <IconWrapper success={isSuccess}>
          {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
        </IconWrapper>
        
        <Title>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </Title>
        
        <Message>
          {isSuccess 
            ? 'Cảm ơn bạn đã đặt tour. Chúng tôi sẽ liên hệ với bạn sớm để xác nhận thông tin.'
            : 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.'}
        </Message>

        <ButtonGroup>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
            Quay lại
          </BackButton>
          <HomeButton onClick={handleHome}>
            Về trang chủ
          </HomeButton>
        </ButtonGroup>
      </ResultCard>
    </ResultContainer>
  );
};

export default PaymentResult; 