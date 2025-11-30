import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';

const ManagerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  // Remove this useEffect - navigation is handled in handleSubmit
  // useEffect(() => {
  //   if (user) {
  //     if (user.role === 'manager') {
  //       navigate('/manager/dashboard');
  //     } else {
  //       navigate('/employee/dashboard');
  //     }
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      const result = await dispatch(login(formData));
      
      if (result.type === 'auth/login/fulfilled') {
        // Validate manager role
        if (result.payload.role !== 'manager') {
          alert('Access denied. This is a manager-only portal. Please use Employee Login.');
          dispatch(clearError());
          return;
        }
        // Wait a bit for state to update, then navigate
        setTimeout(() => {
          navigate('/manager/dashboard', { replace: true });
        }, 200);
      } else if (result.type === 'auth/login/rejected') {
        // Error is already handled by Redux, but ensure it's displayed
        console.error('Login failed:', result.payload);
        alert('Login failed: ' + (result.payload || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-teal">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-teal mb-2">Attendify</h1>
            <p className="text-gray-600">Manager Login</p>
            <Link to="/" className="text-sm text-primary-teal hover:underline mt-2 inline-block">
              ← Back to Portal Selection
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;

