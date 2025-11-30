import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-teal">
      <div className="max-w-4xl w-full mx-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Attendify</h1>
          <p className="text-xl text-white opacity-90">Employee Attendance System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Employee Login Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8 hover:shadow-3xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Portal</h2>
              <p className="text-gray-600">Access your attendance dashboard</p>
            </div>
            <div className="space-y-4">
              <Link to="/employee/login" className="block">
                <Button variant="primary" className="w-full py-3 text-lg">
                  Employee Login
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button variant="outline" className="w-full py-3 text-lg">
                  Register New Account
                </Button>
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Features: Check In/Out, View Attendance, Monthly Summary
              </p>
            </div>
          </div>

          {/* Manager Login Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8 hover:shadow-3xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👔</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Manager Portal</h2>
              <p className="text-gray-600">Manage team attendance</p>
            </div>
            <div className="space-y-4">
              <Link to="/manager/login" className="block">
                <Button variant="secondary" className="w-full py-3 text-lg">
                  Manager Login
                </Button>
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Features: Team Dashboard, Reports, Export CSV, Analytics
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white opacity-75 text-sm">
            Choose your portal to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

