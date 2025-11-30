import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDashboard } from '../../store/slices/dashboardSlice';
import { checkIn, checkOut, getTodayStatus } from '../../store/slices/attendanceSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatTime, formatDate } from '../../utils/formatDate';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { employeeDashboard } = useSelector((state) => state.dashboard);
  const { todayStatus } = useSelector((state) => state.attendance);
  const { isLoading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getEmployeeDashboard());
    dispatch(getTodayStatus());
  }, [dispatch]);

  const handleCheckIn = async () => {
    await dispatch(checkIn());
    dispatch(getTodayStatus());
    dispatch(getEmployeeDashboard());
  };

  const handleCheckOut = async () => {
    await dispatch(checkOut());
    dispatch(getTodayStatus());
    dispatch(getEmployeeDashboard());
  };

  const refreshData = () => {
    dispatch(getTodayStatus());
    dispatch(getEmployeeDashboard());
  };

  if (!employeeDashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { todayStatus: today, monthlySummary, totalHours, recentAttendance } = employeeDashboard;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button variant="outline" onClick={refreshData}>
          Refresh
        </Button>
      </div>

      {/* Today's Status Card */}
      <Card className="bg-gradient-to-r from-primary-blue to-primary-teal text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Today's Status</h2>
            <p className="text-2xl font-bold">
              {today?.checkedIn ? (today?.checkedOut ? 'Checked Out' : 'Checked In') : 'Not Checked In'}
            </p>
            {today?.checkInTime && (
              <p className="mt-2 text-sm opacity-90">
                Check In: {formatTime(today.checkInTime)}
              </p>
            )}
            {today?.checkOutTime && (
              <p className="text-sm opacity-90">
                Check Out: {formatTime(today.checkOutTime)}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className={`status-badge ${today?.status === 'present' ? 'status-present' : today?.status === 'late' ? 'status-late' : 'status-absent'} bg-white`}>
              <span className="text-sm font-semibold capitalize">{today?.status || 'Absent'}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Check In/Out Button */}
      <Card>
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={handleCheckIn}
            disabled={isLoading || today?.checkedIn}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? 'Processing...' : 'Check In'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCheckOut}
            disabled={isLoading || !today?.checkedIn || today?.checkedOut}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? 'Processing...' : 'Check Out'}
          </Button>
        </div>
      </Card>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Present Days</p>
            <p className="text-3xl font-bold text-status-present">{monthlySummary?.present || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Absent Days</p>
            <p className="text-3xl font-bold text-status-absent">{monthlySummary?.absent || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Late Days</p>
            <p className="text-3xl font-bold text-status-late">{monthlySummary?.late || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Hours</p>
            <p className="text-3xl font-bold text-primary-blue">{totalHours?.toFixed(1) || 0}</p>
          </div>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Attendance (Last 7 Days)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance && recentAttendance.length > 0 ? (
                recentAttendance.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.checkInTime ? formatTime(record.checkInTime) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.checkOutTime ? formatTime(record.checkOutTime) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge status-${record.status}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.totalHours || 0} hrs
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

