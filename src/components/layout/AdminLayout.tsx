import React from 'react';
import styled from 'styled-components';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutContainer>
      <AdminSidebar />
      <MainContent>
        <AdminHeader />
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;