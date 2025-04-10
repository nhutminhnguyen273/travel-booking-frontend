import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout; 