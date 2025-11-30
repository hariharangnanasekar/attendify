import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';

const Login = () => {
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
  //     navigate(user.role === 'employee' ? '/employee/dashboard' : '/manager/dashboard');
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
      console.log('Attempting login...', formData.email);
      const result = await dispatch(login(formData));
      console.log('Login result:', result);
      
      if (result.type === 'auth/login/fulfilled') {
        console.log('Login successful, navigating...', result.payload);
        // Validate employee role
        if (result.payload.role !== 'employee') {
          alert('Access denied. This is an employee-only portal. Please use Manager Login.');
          dispatch(clearError());
          return;
        }
        // Wait a bit for state to update, then navigate
        setTimeout(() => {
          console.log('Navigating to /employee/dashboard');
          navigate('/employee/dashboard', { replace: true });
        }, 200);
      } else if (result.type === 'auth/login/rejected') {
        // Error is already handled by Redux, but ensure it's displayed
        console.error('Login failed:', result.payload);
        alert('Login failed: ' + (result.payload || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-teal">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-blue mb-2">Attendify</h1>
            <p className="text-gray-600">Employee Login</p>
            <Link to="/" className="text-sm text-primary-blue hover:underline mt-2 inline-block">
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-primary-blue hover:underline font-medium">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

