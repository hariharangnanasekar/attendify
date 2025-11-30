import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from '../store/slices/authSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Validate token if we have one but no user
    if (token && !user) {
      dispatch(getMe());
    }
  }, [token, user, dispatch]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'employee' ? '/employee/dashboard' : '/manager/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;

