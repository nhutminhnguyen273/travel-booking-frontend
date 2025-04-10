import React from 'react';
import styled from 'styled-components';
import MainLayout from '../../components/layout/MainLayout';
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
    <MainLayout>
      <Wrapper>
        <AboutContainer>
          <PageTitle>Về Travel Booking</PageTitle>
          
          <IntroSection>
            <IntroText>
              Chúng tôi đam mê tạo ra những trải nghiệm du lịch độc đáo và đáng nhớ cho mọi khách hàng.
              Với đội ngũ chuyên gia giàu kinh nghiệm và hiểu biết sâu sắc về các điểm đến,
              chúng tôi cam kết mang đến những chuyến đi hoàn hảo từ khâu lên kế hoạch đến khi kết thúc hành trình.
            </IntroText>
          </IntroSection>
          
          <ValuesSection>
            <SectionTitle>Giá trị cốt lõi</SectionTitle>
            <ValueCards>
              <ValueCard>
                <FaUserShield />
                <ValueTitle>An toàn là ưu tiên hàng đầu</ValueTitle>
                <ValueText>
                  Chúng tôi luôn đặt sự an toàn của khách hàng lên trên hết trong mọi tour du lịch và hoạt động.
                </ValueText>
              </ValueCard>
              
              <ValueCard>
                <FaGem />
                <ValueTitle>Chất lượng vượt trội</ValueTitle>
                <ValueText>
                  Mọi chi tiết đều được chăm chút kỹ lưỡng để đảm bảo chất lượng dịch vụ vượt trên sự mong đợi.
                </ValueText>
              </ValueCard>
              
              <ValueCard>
                <FaHandshake />
                <ValueTitle>Uy tín bền vững</ValueTitle>
                <ValueText>
                  Chúng tôi tự hào xây dựng mối quan hệ dựa trên sự minh bạch và đáng tin cậy với khách hàng.
                </ValueText>
              </ValueCard>
            </ValueCards>
          </ValuesSection>
          
          <StorySection>
            <SectionTitle>Câu chuyện của chúng tôi</SectionTitle>
            <StoryText>
              Travel Booking được thành lập vào năm 2018 với khát vọng mang đến cho du khách Việt Nam và quốc tế những trải nghiệm du lịch chân thực, đậm đà bản sắc và văn hóa địa phương.
            </StoryText>
            <StoryText>
              Từ một nhóm nhỏ những người đam mê du lịch, chúng tôi đã phát triển thành một công ty du lịch uy tín với đội ngũ hơn 50 nhân viên chuyên nghiệp. Trong suốt hành trình đó, chúng tôi đã phục vụ hơn 10.000 du khách và tổ chức thành công hàng nghìn tour du lịch trên khắp Việt Nam và Đông Nam Á.
            </StoryText>
            <StoryText>
              Tầm nhìn của chúng tôi là trở thành đơn vị tiên phong trong việc phát triển du lịch bền vững, góp phần bảo tồn và phát huy các giá trị văn hóa, cảnh quan thiên nhiên của Việt Nam, đồng thời nâng cao đời sống của cộng đồng địa phương thông qua các hoạt động du lịch.
            </StoryText>
          </StorySection>
          
          <ContactSection>
            <SectionTitle>Liên hệ với chúng tôi</SectionTitle>
            <ContactText>
              Hãy liên hệ ngay để được tư vấn và đặt tour phù hợp với nhu cầu của bạn!
            </ContactText>
            <ContactButton href="tel:+84123456789">
              <FaPhoneAlt /> 0123 456 789
            </ContactButton>
          </ContactSection>
        </AboutContainer>
      </Wrapper>
    </MainLayout>
  );
};

export default About; 