import React from "react";
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import authService from '../services/authService';
import { Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      ...publicRoutes,
      ...privateRoutes,
      {
        path: 'auth/login',
        element: authService.isAuthenticated() ? <Navigate to="/" replace /> : <Login />
      },
      {
        path: 'auth/register',
        element: authService.isAuthenticated() ? <Navigate to="/" replace /> : <Register />
      },
      {
        path: 'auth/forgot-password',
        element: authService.isAuthenticated() ? <Navigate to="/" replace /> : <ForgotPassword />
      },
      {
        path: 'auth/reset-password/:token',
        element: authService.isAuthenticated() ? <Navigate to="/" replace /> : <ResetPassword />
      }
    ]
  }
]);

export default router;