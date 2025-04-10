import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  flex: 1;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth.content};
  padding: ${(props) => props.theme.spacing.lg};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`;

const HeroSection = styled.section`
  width: 100%;
  text-align: center;
  padding: ${(props) => props.theme.spacing.xxxl} ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.gradient.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  box-shadow: ${(props) => props.theme.shadows.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://picsum.photos/id/1036/1500/800');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroHeading = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xxxl};
  font-family: ${(props) => props.theme.fonts.heading};
  margin-bottom: ${(props) => props.theme.spacing.base};
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const HeroText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.lg};
  max-width: ${(props) => props.theme.maxWidth.text};
  margin: 0 auto ${(props) => props.theme.spacing.lg};
  line-height: 1.6;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  background-color: white;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  padding: ${(props) => props.theme.spacing.base} ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSizes.base};
  transition: all ${(props) => props.theme.animations.normal};
  box-shadow: ${(props) => props.theme.shadows.md};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${(props) => props.theme.shadows.hover};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-family: ${(props) => props.theme.fonts.heading};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: center;
  color: ${(props) => props.theme.colors.text};
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background: ${(props) => props.theme.colors.primary};
    margin: ${(props) => props.theme.spacing.sm} auto 0;
  }
`;

const TourList = styled.div`
  display: grid;
  gap: ${(props) => props.theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const TourCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  transition: transform ${(props) => props.theme.animations.normal}, 
              box-shadow ${(props) => props.theme.animations.normal};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.shadows.hover};
  }
`;

const TourImageContainer = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
`;

const TourImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${(props) => props.theme.animations.slow};
  
  ${TourCard}:hover & {
    transform: scale(1.05);
  }
`;

const TourBadge = styled.span`
  position: absolute;
  top: ${(props) => props.theme.spacing.base};
  right: ${(props) => props.theme.spacing.base};
  background: ${(props) => props.theme.colors.accent};
  color: white;
  padding: ${(props) => props.theme.spacing.xxs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: bold;
`;

const TourContent = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
`;

const TourTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text};
`;

const TourInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.muted};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  
  svg {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const TourPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.base};
  
  span {
    font-size: ${(props) => props.theme.fontSizes.lg};
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const TourButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  transition: all ${(props) => props.theme.animations.fast};
  
  &:hover {
    gap: ${(props) => props.theme.spacing.sm};
    color: ${(props) => props.theme.colors.accent};
  }
`;

const PromoSection = styled.section`
  margin: ${(props) => props.theme.spacing.xxl} 0;
  padding: ${(props) => props.theme.spacing.xl};
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const PromoTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.xl};
  margin-bottom: ${(props) => props.theme.spacing.base};
  color: ${(props) => props.theme.colors.primary};
`;

const PromoText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.base};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-width: ${(props) => props.theme.maxWidth.text};
`;

const Home: React.FC = () => {

  const featuredTours = [
    {
      id: 1,
      name: 'Khám phá Đà Lạt 3N2Đ',
      image: 'https://picsum.photos/id/1036/500/300',
      price: '3.000.000₫',
      location: 'Đà Lạt, Lâm Đồng',
      duration: '3 ngày 2 đêm',
      badge: 'Phổ biến',
    },
    {
      id: 2,
      name: 'Tour Phú Quốc nghỉ dưỡng',
      image: 'https://picsum.photos/id/1043/500/300',
      price: '4.500.000₫',
      location: 'Phú Quốc, Kiên Giang',
      duration: '4 ngày 3 đêm',
      badge: 'Mới',
    },
    {
      id: 3,
      name: 'Trải nghiệm Hà Giang',
      image: 'https://picsum.photos/id/1015/500/300',
      price: '5.200.000₫',
      location: 'Hà Giang',
      duration: '5 ngày 4 đêm',
      badge: 'Hot',
    },
  ];

  return (
    <Wrapper>
      <ContentContainer>
        <HeroSection>
          <HeroContent>
            <HeroHeading>Khám phá Việt Nam cùng TravelBooking</HeroHeading>
            <HeroText>
              Đặt tour du lịch dễ dàng, nhanh chóng và an toàn. Khám phá những điểm đến tuyệt đẹp trên khắp Việt Nam với dịch vụ chất lượng hàng đầu!
            </HeroText>
            <HeroButton to="/tours">
              Khám phá ngay <FaArrowRight />
            </HeroButton>
          </HeroContent>
        </HeroSection>

        <SectionTitle>Tour nổi bật</SectionTitle>
        <TourList>
          {featuredTours.map((tour) => (
            <TourCard key={tour.id}>
              <TourImageContainer>
                <TourImage src={tour.image} alt={tour.name} />
                {tour.badge && <TourBadge>{tour.badge}</TourBadge>}
              </TourImageContainer>
              <TourContent>
                <TourTitle>{tour.name}</TourTitle>
                <TourInfo>
                  <FaMapMarkerAlt /> {tour.location}
                </TourInfo>
                <TourInfo>
                  <FaCalendarAlt /> {tour.duration}
                </TourInfo>
                <TourPrice>
                  <span>{tour.price}</span>
                  <TourButton to={`/tour/${tour.id}`}>
                    Chi tiết <FaArrowRight />
                  </TourButton>
                </TourPrice>
              </TourContent>
            </TourCard>
          ))}
        </TourList>

        <PromoSection>
          <PromoTitle>Ưu đãi đặc biệt</PromoTitle>
          <PromoText>
            Đăng ký và nhận ngay ưu đãi 10% cho tour đầu tiên của bạn. Áp dụng cho tất cả các tour du lịch trong nước đến hết tháng 12.
          </PromoText>
          <HeroButton to="/register">
            Đăng ký ngay
          </HeroButton>
        </PromoSection>
      </ContentContainer>
    </Wrapper>
  );
};

export default Home;