import { RouteObject } from 'react-router-dom';
import Home from '../pages/main/Home';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Tours from '../pages/main/Tours';
import TourDetail from '../pages/main/TourDetail';
import About from '../pages/main/About';
import Contact from '../pages/main/Contact';

const publicRoutes: RouteObject[] = [
    {
      path: '',
      element: <Home />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: 'tours',
      element: <Tours />,
    },
    {
      path: 'tour/:id',
      element: <TourDetail />,
    },
    {
      path: 'about',
      element: <About />,
    },
    {
      path: 'contact',
      element: <Contact />,
    },
  ];
  
  export default publicRoutes;