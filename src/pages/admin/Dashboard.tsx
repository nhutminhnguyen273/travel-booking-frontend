import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FaUsers, FaShoppingCart, FaPlaneDeparture, FaChartBar } from 'react-icons/fa';

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

const Dashboard: React.FC = () => {
  const theme = useTheme();

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
              <StatValue>1,230</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <FaShoppingCart size={32} color={theme.colors.secondary} />
            <StatInfo>
              <StatLabel>Đơn hàng</StatLabel>
              <StatValue>245</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <FaPlaneDeparture size={32} color={theme.colors.accent} />
            <StatInfo>
              <StatLabel>Tour đang diễn ra</StatLabel>
              <StatValue>38</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <FaChartBar size={32} color={theme.colors.success} />
            <StatInfo>
              <StatLabel>Doanh thu</StatLabel>
              <StatValue>120,000,000₫</StatValue>
            </StatInfo>
          </StatCard>
        </StatGrid>

        <RecentTours>
          <h2 style={{ fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.sm }}>Tour Gần Đây</h2>
          <TourItem>Tour Đà Lạt - 03/2025</TourItem>
          <TourItem>Tour Hạ Long - 02/2025</TourItem>
          <TourItem>Tour Phú Quốc - 01/2025</TourItem>
        </RecentTours>
      </DashboardWrapper>
    </DashboardContainer>
  );
};

export default Dashboard;