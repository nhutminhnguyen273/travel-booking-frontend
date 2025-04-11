import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import PaymentResult from './pages/main/PaymentResult';

const AppContainer = styled.div`
  min-height: 100vh;
`;

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <AppContainer>
        {isAdminRoute ? (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ) : (
          <MainLayout>
            <Outlet />
          </MainLayout>
        )}
      </AppContainer>
    </AuthProvider>
  );
};

export default App;