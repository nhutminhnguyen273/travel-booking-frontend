import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import App from '../App';
import authService from '../services/authService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      ...publicRoutes,
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
      },
      ...privateRoutes
    ]
  }
]);

export default router;