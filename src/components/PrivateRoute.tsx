import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: ('admin' | 'psychologist' | 'institute' | 'client')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Log unauthorized access attempt
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        error: 'Unauthorized access attempt',
        path: location.pathname
      }
    }));
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Log insufficient permissions
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        error: 'Insufficient permissions',
        userRole: user.role,
        requiredRoles: roles
      }
    }));
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;