import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.xl} 0;
  color: ${(props) => props.theme.colors.text};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  margin-top: ${(props) => props.theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 ${(props) => props.theme.spacing.lg};
`;

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
`;

const FooterSection = styled.div``;

const Title = styled.h4`
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.primary};
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.fontSizes.base};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.muted || props.theme.colors.text};
`;

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterContainer>
          <FooterSection>
            <Title>Về chúng tôi</Title>
            <p>
              TravelBooking là nền tảng giúp bạn dễ dàng tìm kiếm và đặt tour du lịch chất lượng với giá tốt nhất.
            </p>
          </FooterSection>
          <FooterSection>
            <Title>Liên kết</Title>
            <FooterLink to="/">Trang chủ</FooterLink>
            <FooterLink to="/tours">Tour</FooterLink>
            <FooterLink to="/about">Giới thiệu</FooterLink>
            <FooterLink to="/contact">Liên hệ</FooterLink>
          </FooterSection>
          <FooterSection>
            <Title>Liên hệ</Title>
            <p>Địa chỉ: 123 Trần Phú, Quận 5, TP.HCM</p>
            <p>Email: support@travelbooking.vn</p>
            <p>Điện thoại: 0123 456 789</p>
          </FooterSection>
        </FooterContainer>
        <Copyright>
          &copy; {new Date().getFullYear()} TravelBooking. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;