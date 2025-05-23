import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { FaUsers, FaShoppingCart, FaPlaneDeparture, FaChartBar, FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import statisticalService, { StatisticalData } from '../../services/statisticalService';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DashboardWrapper = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.background};
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-family: ${(props) => props.theme.fonts.heading};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const StatGrid = styled.div`
  display: grid;
  gap: ${(props) => props.theme.spacing.lg};
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.base};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.muted};
`;

const StatValue = styled.span`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

const RecentTours = styled.div`
  background: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

const TourItem = styled.div`
  padding: ${(props) => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  font-size: ${(props) => props.theme.fontSizes.base};
`;

const StatSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState<StatisticalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await statisticalService.getDailyStatistics();
        setStatistics(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      <DashboardWrapper>
        <Heading>Trang Quản Trị</Heading>

        <StatGrid>
          <StatCard>
            <FaUsers size={32} color={theme.colors.primary} />
            <StatInfo>
              <StatLabel>Người dùng</StatLabel>
              <StatValue>{statistics?.totalUsers || 0}</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <FaShoppingCart size={32} color={theme.colors.secondary} />
            <StatInfo>
              <StatLabel>Đơn hàng</StatLabel>
              <StatValue>{statistics?.totalBookings || 0}</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <FaPlaneDeparture size={32} color={theme.colors.accent} />
            <StatInfo>
              <StatLabel>Tour đang diễn ra</StatLabel>
              <StatValue>{statistics?.totalTours || 0}</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <FaChartBar size={32} color={theme.colors.success} />
            <StatInfo>
              <StatLabel>Doanh thu</StatLabel>
              <StatValue>{statistics?.totalRevenue?.toLocaleString('vi-VN') || 0}₫</StatValue>
            </StatInfo>
          </StatCard>
        </StatGrid>

        <StatSection>
          <SectionTitle>Trạng thái đơn hàng</SectionTitle>
          <StatGrid>
            <StatCard>
              <FaClock size={24} color={theme.colors.warning} />
              <StatInfo>
                <StatLabel>Đang chờ</StatLabel>
                <StatValue>{statistics?.bookingStatus?.pending || 0}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <FaCheckCircle size={24} color={theme.colors.success} />
              <StatInfo>
                <StatLabel>Đã xác nhận</StatLabel>
                <StatValue>{statistics?.bookingStatus?.confirmed || 0}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <FaTimesCircle size={24} color={theme.colors.error} />
              <StatInfo>
                <StatLabel>Đã hủy</StatLabel>
                <StatValue>{statistics?.bookingStatus?.cancelled || 0}</StatValue>
              </StatInfo>
            </StatCard>
          </StatGrid>
        </StatSection>

        <StatSection>
          <SectionTitle>Phương thức thanh toán</SectionTitle>
          <StatGrid>
            <StatCard>
              <FaMoneyBillWave size={24} color={theme.colors.primary} />
              <StatInfo>
                <StatLabel>VNPay</StatLabel>
                <StatValue>{statistics?.paymentMethods?.VNPay || 0}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <FaMoneyBillWave size={24} color={theme.colors.secondary} />
              <StatInfo>
                <StatLabel>MoMo</StatLabel>
                <StatValue>{statistics?.paymentMethods?.MoMo || 0}</StatValue>
              </StatInfo>
            </StatCard>
            <StatCard>
              <FaMoneyBillWave size={24} color={theme.colors.accent} />
              <StatInfo>
                <StatLabel>Stripe</StatLabel>
                <StatValue>{statistics?.paymentMethods?.Stripe || 0}</StatValue>
              </StatInfo>
            </StatCard>
          </StatGrid>
        </StatSection>

        <RecentTours>
          <h2 style={{ fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.sm }}>Tour Gần Đây</h2>
          {statistics?.revenueByTour && statistics.revenueByTour.length > 0 ? (
            statistics.revenueByTour.slice(0, 3).map((tour, index) => (
              <TourItem key={index}>
                Tour {tour.tour} - {tour.revenue.toLocaleString('vi-VN')}₫
              </TourItem>
            ))
          ) : (
            <TourItem>Chưa có dữ liệu tour</TourItem>
          )}
        </RecentTours>
      </DashboardWrapper>
    </DashboardContainer>
  );
};

export default Dashboard;