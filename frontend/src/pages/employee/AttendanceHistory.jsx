import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getMyHistory, getMySummary } from '../../store/slices/attendanceSlice';
import Card from '../../components/common/Card';
import { formatDate, formatTime } from '../../utils/formatDate';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { history, summary } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'

  useEffect(() => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }));
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#22C55E';
      case 'absent':
        return '#EF4444';
      case 'late':
        return '#FACC15';
      case 'half-day':
        return '#F97316';
      default:
        return '#E5E7EB';
    }
  };

  const getAttendanceForDate = (date) => {
    if (!history) return null;
    const dateStr = date.toISOString().split('T')[0];
    return history.find((record) => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const attendance = getAttendanceForDate(date);
      if (attendance) {
        return 'attendance-day';
      }
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const attendance = getAttendanceForDate(date);
      if (attendance) {
        return (
          <div
            className="w-full h-1 rounded-full mt-1"
            style={{ backgroundColor: getStatusColor(attendance.status) }}
          />
        );
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    const attendance = getAttendanceForDate(date);
    setSelectedDate({ date, attendance });
  };

  const filteredHistory = history
    ? history.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() + 1 === selectedMonth &&
          recordDate.getFullYear() === selectedYear
        );
      })
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Attendance History</h1>
        <div className="flex space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="input-field"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input-field"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Present</p>
              <p className="text-3xl font-bold text-status-present">{summary.present}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-3xl font-bold text-status-absent">{summary.absent}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Late</p>
              <p className="text-3xl font-bold text-status-late">{summary.late}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Half Day</p>
              <p className="text-3xl font-bold text-status-halfDay">{summary.halfDay}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <Calendar
              onChange={handleDateClick}
              value={selectedDate?.date}
              tileClassName={tileClassName}
              tileContent={tileContent}
              className="w-full"
            />
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-status-present"></div>
                <span className="text-sm">Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-status-absent"></div>
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-status-late"></div>
                <span className="text-sm">Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-status-halfDay"></div>
                <span className="text-sm">Half Day</span>
              </div>
            </div>
          </Card>

          {selectedDate && selectedDate.attendance && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                {formatDate(selectedDate.date)}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{selectedDate.attendance.status}</p>
                </div>
                {selectedDate.attendance.checkInTime && (
                  <div>
                    <p className="text-sm text-gray-600">Check In</p>
                    <p className="font-medium">{formatTime(selectedDate.attendance.checkInTime)}</p>
                  </div>
                )}
                {selectedDate.attendance.checkOutTime && (
                  <div>
                    <p className="text-sm text-gray-600">Check Out</p>
                    <p className="font-medium">{formatTime(selectedDate.attendance.checkOutTime)}</p>
                  </div>
                )}
                {selectedDate.attendance.totalHours && (
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="font-medium">{selectedDate.attendance.totalHours} hrs</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
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
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((record, index) => (
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
                      No attendance records found for this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendanceHistory;

