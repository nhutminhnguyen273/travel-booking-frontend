import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import authService from './services/authService';

const AppContainer = styled.div`
  /* Styles might be moved to specific layouts */
  min-height: 100vh;
`;

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      const user = authService.getUser();
      
      // Redirect admin from public/user pages to admin dashboard
      if (user?.role === 'admin' && !location.pathname.startsWith('/admin')) {
        navigate('/admin/dashboard');
        return; // Stop further checks
      }
      
      // Redirect authenticated users from auth pages
      if (location.pathname === '/auth/login' || location.pathname === '/auth/register') {
        if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
        return; // Stop further checks
      }
    } else {
      // Redirect unauthenticated users from protected pages to login
      const protectedPaths = ['/profile', '/favorites', '/bookings', '/settings', '/admin'];
      const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
      
      // Add check for location.pathname !== '/auth/login' to prevent redirect loop
      if (isProtectedPath && location.pathname !== '/auth/login') { 
        navigate('/auth/login');
        return; // Stop further checks
      }
    }
  }, [navigate, location.pathname]);

  // Use AdminLayout for admin routes, MainLayout for others
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
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
  );
}

export default App;