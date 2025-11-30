import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import { formatDate } from '../../utils/formatDate';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <p className="text-lg text-gray-900">{user.employeeId || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <p className="text-lg text-gray-900">{user.department || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <p className="text-lg text-gray-900 capitalize">{user.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <p className="text-lg text-gray-900">
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

