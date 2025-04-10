import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import authService from '../../services/authService';

const HeaderContainer = styled.header`
  height: 64px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.error};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.base};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.error}10;
  }
`;

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/auth/login');
  };

  return (
    <HeaderContainer>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt /> Đăng xuất
      </LogoutButton>
    </HeaderContainer>
  );
};

export default AdminHeader; 