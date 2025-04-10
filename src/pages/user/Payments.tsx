import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import MainLayout from '../../components/layout/MainLayout';
import { paymentService } from '../../services/paymentService';
import { Payment } from '../../types/payment';

const PageWrapper = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: ${props => props.theme.maxWidth.content};
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.base};
  font-family: ${props => props.theme.fonts.heading};
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PaymentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const PaymentCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const PaymentHeader = styled.div`
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary}10;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaymentId = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const PaymentStatus = styled.span<{ status: string }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.round};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case 'pending':
        return `
          background: ${props.theme.colors.accent}20;
          color: ${props.theme.colors.accent};
        `;
      case 'failed':
        return `
          background: ${props.theme.colors.error}20;
          color: ${props.theme.colors.error};
        `;
      default:
        return `
          background: ${props.theme.colors.muted}20;
          color: ${props.theme.colors.muted};
        `;
    }
  }}
`;

const PaymentContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const PaymentInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.base};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.muted};

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ExploreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const data = await paymentService.getPaymentsByUser(userId);
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Không thể tải lịch sử thanh toán. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
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

  if (error) {
    return (
      <MainLayout>
        <PageWrapper>
          <Container>
            <Title>Lỗi</Title>
            <Subtitle>{error}</Subtitle>
          </Container>
        </PageWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageWrapper>
        <Container>
          <Title>Lịch sử thanh toán</Title>
          <Subtitle>Theo dõi các giao dịch thanh toán của bạn</Subtitle>

          {payments.length === 0 ? (
            <EmptyState>
              <EmptyStateText>
                Bạn chưa có giao dịch thanh toán nào
              </EmptyStateText>
              <ExploreButton to="/tours">
                Khám phá các tour
              </ExploreButton>
            </EmptyState>
          ) : (
            <PaymentList>
              {payments.map(payment => (
                <PaymentCard key={payment.transactionId}>
                  <PaymentHeader>
                    <PaymentId>Mã giao dịch: {payment.transactionId}</PaymentId>
                    <PaymentStatus status={payment.paymentStatus}>
                      {getStatusText(payment.paymentStatus)}
                    </PaymentStatus>
                  </PaymentHeader>
                  <PaymentContent>
                    <PaymentInfo>
                      <InfoItem>
                        <FaCreditCard />
                        {payment.paymentMethod}
                      </InfoItem>
                      <InfoItem>
                        <FaCalendarAlt />
                        {formatDate(payment.paidAt)}
                      </InfoItem>
                      <InfoItem>
                        {payment.paymentStatus === 'completed' ? (
                          <FaCheckCircle style={{ color: 'green' }} />
                        ) : (
                          <FaTimesCircle style={{ color: 'red' }} />
                        )}
                        {payment.currency}
                      </InfoItem>
                    </PaymentInfo>
                  </PaymentContent>
                </PaymentCard>
              ))}
            </PaymentList>
          )}
        </Container>
      </PageWrapper>
    </MainLayout>
  );
};

export default Payments; 