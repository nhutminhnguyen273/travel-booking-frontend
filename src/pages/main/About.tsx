import React from 'react';
import styled from 'styled-components';
import { FaUserShield, FaGem, FaHandshake, FaPhoneAlt } from 'react-icons/fa';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const AboutContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 ${({ theme }) => theme.spacing.base};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const IntroSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const IntroText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.7;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ValuesSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    margin: ${({ theme }) => theme.spacing.sm} auto 0;
  }
`;

const ValueCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ValueCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
  
  svg {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.base};
  }
`;

const ValueTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const ValueText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.6;
`;

const StorySection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StoryText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.base};
`;

const ContactSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

const ContactText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: bold;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

const About: React.FC = () => {
  return (
    <Wrapper>
      <AboutContainer>
        <PageTitle>Về chúng tôi</PageTitle>
        
        <IntroSection>
          <IntroText>
            TravelBooking là nền tảng đặt tour du lịch trực tuyến hàng đầu tại Việt Nam, 
            mang đến cho khách hàng những trải nghiệm du lịch tuyệt vời với dịch vụ chất lượng cao.
          </IntroText>
        </IntroSection>

        <ValuesSection>
          <SectionTitle>Giá trị cốt lõi</SectionTitle>
          <ValueCards>
            <ValueCard>
              <FaUserShield />
              <ValueTitle>An toàn & Tin cậy</ValueTitle>
              <ValueText>
                Cam kết mang đến những tour du lịch an toàn, chất lượng với đội ngũ hướng dẫn viên chuyên nghiệp.
              </ValueText>
            </ValueCard>
            <ValueCard>
              <FaGem />
              <ValueTitle>Chất lượng dịch vụ</ValueTitle>
              <ValueText>
                Đảm bảo mọi dịch vụ đều đạt tiêu chuẩn cao nhất, từ khách sạn đến phương tiện di chuyển.
              </ValueText>
            </ValueCard>
            <ValueCard>
              <FaHandshake />
              <ValueTitle>Hỗ trợ 24/7</ValueTitle>
              <ValueText>
                Luôn sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi với đội ngũ chăm sóc khách hàng chuyên nghiệp.
              </ValueText>
            </ValueCard>
          </ValueCards>
        </ValuesSection>

        <StorySection>
          <SectionTitle>Câu chuyện của chúng tôi</SectionTitle>
          <StoryText>
            TravelBooking được thành lập với sứ mệnh mang đến những trải nghiệm du lịch tuyệt vời 
            cho mọi người. Chúng tôi tin rằng mỗi chuyến đi đều là một câu chuyện đặc biệt, và chúng tôi 
            sẽ làm tất cả để đảm bảo câu chuyện đó trở nên hoàn hảo.
          </StoryText>
        </StorySection>

        <ContactSection>
          <ContactText>
            Bạn có câu hỏi? Hãy liên hệ với chúng tôi ngay hôm nay!
          </ContactText>
          <ContactButton href="/contact">
            <FaPhoneAlt /> Liên hệ ngay
          </ContactButton>
        </ContactSection>
      </AboutContainer>
    </Wrapper>
  );
};

export default About; 