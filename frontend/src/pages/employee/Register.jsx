import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'General',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  // Remove this useEffect - navigation is handled in handleSubmit
  // useEffect(() => {
  //   if (user) {
  //     navigate('/employee/dashboard');
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

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log('Attempting registration...', registerData.email);
      const result = await dispatch(register(registerData));
      console.log('Registration result:', result);
      
      if (result.type === 'auth/register/fulfilled') {
        console.log('Registration successful, navigating...', result.payload);
        // Wait a bit for state to update, then navigate
        setTimeout(() => {
          console.log('Navigating to /employee/dashboard');
          navigate('/employee/dashboard', { replace: true });
        }, 200);
      } else if (result.type === 'auth/register/rejected') {
        // Error is already handled by Redux, but ensure it's displayed
        console.error('Registration failed:', result.payload);
        alert('Registration failed: ' + (result.payload || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-teal">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-blue mb-2">Attendify</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

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
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              >
                <option value="General">General</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
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
                minLength={6}
                className="input-field"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Confirm your password"
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading || formData.password !== formData.confirmPassword}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary-blue hover:underline font-medium">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

