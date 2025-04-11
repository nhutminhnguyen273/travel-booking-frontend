import { useEffect } from 'react';
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
  const { state } = location;
  const isSuccess = state?.status === 'success';

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }

    if (isSuccess) {
      toast.success('Thanh toán thành công!');
    } else {
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
    }
  }, [state, isSuccess, navigate]);

  if (!state) return null;

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
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Quay lại
          </BackButton>
          <HomeButton onClick={() => navigate('/')}>
            Về trang chủ
          </HomeButton>
        </ButtonGroup>
      </ResultCard>
    </ResultContainer>
  );
};

export default PaymentResult; 