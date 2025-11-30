import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance } from '../../store/slices/attendanceSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate, formatTime } from '../../utils/formatDate';
import api from '../../services/api';

const AllAttendance = () => {
  const dispatch = useDispatch();
  const { allAttendance } = useSelector((state) => state.attendance);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
    // Load all attendance on mount
    const loadAttendance = async () => {
      await dispatch(getAllAttendance({}));
    };
    loadAttendance();
  }, [dispatch]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/attendance/today-status');
      const uniqueEmployees = Array.from(
        new Map(response.data.map((emp) => [emp.employeeId, emp])).values()
      );
      setEmployees(uniqueEmployees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    const filterParams = {};
    if (filters.employeeId) filterParams.employeeId = filters.employeeId;
    if (filters.startDate) filterParams.startDate = filters.startDate;
    if (filters.endDate) filterParams.endDate = filters.endDate;
    if (filters.status) filterParams.status = filters.status;
    dispatch(getAllAttendance(filterParams));
  };

  const handleClearFilters = () => {
    setFilters({
      employeeId: '',
      startDate: '',
      endDate: '',
      status: '',
    });
    dispatch(getAllAttendance({}));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">All Employees Attendance</h1>

      {/* Filters */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee
            </label>
            <select
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <Button variant="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
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
              {allAttendance && allAttendance.length > 0 ? (
                allAttendance.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.userId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.userId?.employeeId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.userId?.department || 'N/A'}
                    </td>
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
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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

export default AllAttendance;

