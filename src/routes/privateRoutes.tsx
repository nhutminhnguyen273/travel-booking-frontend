import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import TourManagement from '../pages/admin/TourManagement';
import VoucherManagement from '../pages/admin/VoucherManagement';
import ContactManagement from '../pages/admin/ContactManagement';
import Profile from '../pages/user/Profile';
import Bookings from '../pages/user/Booking';
import Booking from '../pages/user/Booking';
import Payments from '../pages/user/Payments';
import Settings from '../pages/user/Settings';
import Favorites from '../pages/main/Favorites';
import AddTour from '../pages/admin/AddTour';
import EditTour from '../pages/admin/EditTour';
import AddVoucher from '../pages/admin/AddVoucher';
import UpdateVoucher from '../pages/admin/UpdateVoucher';
import AddUser from '../pages/admin/AddUser';
import EditUser from '../pages/admin/EditUser';
import BlogManagement from '../pages/admin/BlogManagement';
import AddBlog from '../pages/admin/AddBlog';
import EditBlog from '../pages/admin/EditBlog';


const PrivateRoutes = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

const AdminRoutes = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  
  if (!isAuthenticated || !user || user.role !== 'admin') {
    console.log('Authentication failed - redirecting to home');
    console.log('Failure reason:', {
      notAuthenticated: !isAuthenticated,
      noUser: !user,
      notAdmin: user?.role !== 'admin'
    });
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const privateRoutes = [
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'admin',
        element: <AdminRoutes />,
        children: [
          {
            path: '',
            element: <Navigate to="dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'users',
            element: <UserManagement />
          },
          {
            path: 'users/add',
            element: <AddUser />
          },
          {
            path: 'users/edit/:id',
            element: <EditUser />
          },
          {
            path: 'tours',
            element: <TourManagement />
          },
          {
            path: 'tours/add',
            element: <AddTour />
          },
          {
            path: 'tours/edit/:id',
            element: <EditTour />
          },
          {
            path: 'vouchers',
            element: <VoucherManagement />
          },
          {
            path: 'vouchers/add',
            element: <AddVoucher />
          },
          {
            path: 'vouchers/edit/:id',
            element: <UpdateVoucher />
          },
          {
            path: 'contacts',
            element: <ContactManagement />
          },
          {
            path: 'blogs',
            element: <BlogManagement />
          },
          {
            path: 'blogs/add',
            element: <AddBlog />
          },
          {
            path: 'blogs/edit/:id',
            element: <EditBlog />
          }
        ]
      },
      {
        path: 'bookings',
        element: <Bookings />
      },
      {
        path: 'booking/:id',
        element: <Booking />
      },
      {
        path: 'payments',
        element: <Payments />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'favorites',
        element: <Favorites />
      }
    ]
  }
];

export default privateRoutes;