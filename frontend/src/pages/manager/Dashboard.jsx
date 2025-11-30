import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerDashboard } from '../../store/slices/dashboardSlice';
import { getTodayStatusAll } from '../../store/slices/attendanceSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { managerDashboard } = useSelector((state) => state.dashboard);
  const { isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await dispatch(getManagerDashboard());
        await dispatch(getTodayStatusAll());
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };
    loadDashboard();
  }, [dispatch]);

  const refreshData = () => {
    dispatch(getManagerDashboard());
    dispatch(getTodayStatusAll());
  };

  if (isLoading || !managerDashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const {
    totalEmployees = 0,
    todayAttendance = { present: 0, absent: 0 },
    lateArrivals = [],
    weeklyTrend = [],
    departmentWise = [],
    absentEmployees = [],
  } = managerDashboard;

  const COLORS = ['#22C55E', '#EF4444', '#FACC15', '#F97316', '#1D4ED8'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <Button variant="outline" onClick={refreshData}>
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-primary-blue">{totalEmployees}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Present Today</p>
            <p className="text-3xl font-bold text-status-present">{todayAttendance?.present || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Absent Today</p>
            <p className="text-3xl font-bold text-status-absent">{todayAttendance?.absent || 0}</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Weekly Attendance Trend</h2>
          {weeklyTrend && weeklyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#22C55E"
                  name="Present"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1D4ED8"
                  name="Total Employees"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available
            </div>
          )}
        </Card>

        {/* Department-wise Chart */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Department-wise Attendance</h2>
          {departmentWise && departmentWise.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentWise}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#22C55E" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Late Arrivals and Absent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Arrivals */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Late Arrivals Today</h2>
          {lateArrivals && lateArrivals.length > 0 ? (
            <div className="space-y-3">
              {lateArrivals.map((employee, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.employeeId} • {employee.department}</p>
                  </div>
                  <span className="status-badge status-late">Late</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No late arrivals today</p>
          )}
        </Card>

        {/* Absent Employees */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Absent Employees Today</h2>
          {absentEmployees && absentEmployees.length > 0 ? (
            <div className="space-y-3">
              {absentEmployees.map((employee, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.employeeId} • {employee.department}</p>
                  </div>
                  <span className="status-badge status-absent">Absent</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">All employees are present today</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

