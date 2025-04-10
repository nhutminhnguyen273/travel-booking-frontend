import React from "react";
import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import authService from '../services/auth.service';
import App from '../App';

const AppRoutes: React.FC = () => {
    return (
      <Routes>
        {/* Public routes */}
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
  
        {/* Private routes */}
        {privateRoutes.map((route, index) => (
          <Route key={index} element={route.element}>
            {route.children?.map((childRoute, childIndex) => (
              <Route
                key={childIndex}
                path={childRoute.path}
                element={childRoute.element}
              >
                {childRoute.children?.map((nestedRoute, nestedIndex) => (
                  <Route
                    key={nestedIndex}
                    path={nestedRoute.path}
                    element={nestedRoute.element}
                  />
                ))}
              </Route>
            ))}
          </Route>
        ))}
      </Routes>
    );
  };
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: 'auth/login',
          element: <Login />
        },
        {
          path: 'auth/register',
          element: <Register />
        },
        {
          path: 'auth/forgot-password',
          element: <ForgotPassword />
        },
        {
          path: 'auth/reset-password/:token',
          element: <ResetPassword />
        }
      ]
    }
  ]);

  export default router;