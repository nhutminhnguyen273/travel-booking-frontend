import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaCog, FaListAlt, FaHeart } from 'react-icons/fa';
import authService from '../../services/authService';

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.sm} 0;
  display: flex;
  justify-content: center;
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 ${(props) => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-family: ${(props) => props.theme.fonts.heading};
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${(props) => props.theme.spacing.lg};
`;

const NavLink = styled(Link)`
  font-size: ${(props) => props.theme.fontSizes.base};
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  position: relative;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const UserSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserIcon = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};

  &:hover {
    opacity: 0.8;
  }
`;

const AuthButton = styled(Link)`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.base};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSizes.sm};
  display: inline-block;

  &:hover {
    background-color: ${(props) => props.theme.colors.accent};
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${(props) => props.theme.spacing.xs};
  width: 180px;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  z-index: 10;
  transition: all 0.3s ease;
  
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
  transform: ${(props) => (props.$isOpen ? 'translateY(0)' : 'translateY(-10px)')};
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.base};
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  
  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.primary};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.base};
  color: ${(props) => props.theme.colors.error};
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSizes.base};
  
  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const UserInfo = styled.div`
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.base};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

const UserEmail = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.muted};
`;

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      // Get user information
      const userData = authService.getUser();
      setUser(userData);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    // setIsAuthenticated(false);
    // setUser(null);
    // setDropdownOpen(false);
    navigate('/auth/login');
  };

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/">TravelBooking</Logo>
        <Nav>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/tours">Tour</NavLink>
          <NavLink to="/about">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
        </Nav>
        <UserSection ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              <UserIcon onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle />
              </UserIcon>
              <Dropdown $isOpen={dropdownOpen}>
                <UserInfo>
                  <UserName>{user?.fullName || user?.username || 'Người dùng'}</UserName>
                  <UserEmail>{user?.email || ''}</UserEmail>
                </UserInfo>
                <DropdownItem to="/profile">
                  <FaUserCircle /> Tài khoản
                </DropdownItem>
                <DropdownItem to="/favorites">
                  <FaHeart /> Tour yêu thích
                </DropdownItem>
                <DropdownItem to="/bookings">
                  <FaListAlt /> Đơn hàng
                </DropdownItem>
                <DropdownItem to="/settings">
                  <FaCog /> Cài đặt
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt /> Đăng xuất
                </LogoutButton>
              </Dropdown>
            </>
          ) : (
            <AuthButton to="/auth/login">Đăng nhập</AuthButton>
          )}
        </UserSection>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;