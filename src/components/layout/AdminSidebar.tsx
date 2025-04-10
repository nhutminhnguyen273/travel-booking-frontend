import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaPlane, FaShoppingCart, FaCog, FaTicketAlt } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
`;

const Logo = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.base};
  color: ${props => props.$active ? '#fff' : props.theme.colors.text};
  background-color: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  margin-bottom: ${props => props.theme.spacing.sm};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: #fff;
  }
`;

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <Logo>Admin Panel</Logo>
      <nav>
        <NavItem to="/admin/dashboard" $active={location.pathname === '/admin/dashboard'}>
          <FaHome /> Dashboard
        </NavItem>
        <NavItem to="/admin/users" $active={location.pathname === '/admin/users'}>
          <FaUsers /> Users
        </NavItem>
        <NavItem to="/admin/tours" $active={location.pathname === '/admin/tours'}>
          <FaPlane /> Tours
        </NavItem>
        <NavItem to="/admin/vouchers" $active={location.pathname === '/admin/vouchers'}>
          <FaTicketAlt /> Vouchers
        </NavItem>
        <NavItem to="/admin/orders" $active={location.pathname === '/admin/orders'}>
          <FaShoppingCart /> Orders
        </NavItem>
        <NavItem to="/admin/settings" $active={location.pathname === '/admin/settings'}>
          <FaCog /> Settings
        </NavItem>
      </nav>
    </SidebarContainer>
  );
};

export default AdminSidebar; 