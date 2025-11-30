import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAllAttendance } from '../../store/slices/attendanceSlice';
import Card from '../../components/common/Card';
import { formatDate, formatTime } from '../../utils/formatDate';

const TeamCalendar = () => {
  const dispatch = useDispatch();
  const { allAttendance } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);
    dispatch(
      getAllAttendance({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
    );
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
    if (!allAttendance) return [];
    const dateStr = date.toISOString().split('T')[0];
    return allAttendance.filter((record) => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const attendance = getAttendanceForDate(date);
      if (attendance.length > 0) {
        const presentCount = attendance.filter((a) => a.status !== 'absent').length;
        const totalCount = attendance.length;
        return (
          <div className="mt-1 text-xs text-center">
            <div
              className="w-full h-1 rounded-full mb-1"
              style={{ backgroundColor: getStatusColor('present') }}
            />
            <span className="text-gray-600">{presentCount}/{totalCount}</span>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    const attendance = getAttendanceForDate(date);
    setSelectedDate({ date, attendance });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Team Calendar</h1>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Calendar
            onChange={handleDateClick}
            value={selectedDate?.date}
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

        {selectedDate && selectedDate.attendance && selectedDate.attendance.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              {formatDate(selectedDate.date)}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDate.attendance.map((record, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.userId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.userId?.employeeId || 'N/A'} • {record.userId?.department || 'N/A'}
                      </p>
                    </div>
                    <span className={`status-badge status-${record.status}`}>
                      {record.status}
                    </span>
                  </div>
                  {record.checkInTime && (
                    <p className="text-xs text-gray-500">
                      Check In: {formatTime(record.checkInTime)}
                    </p>
                  )}
                  {record.checkOutTime && (
                    <p className="text-xs text-gray-500">
                      Check Out: {formatTime(record.checkOutTime)}
                    </p>
                  )}
                  {record.totalHours && (
                    <p className="text-xs text-gray-500">
                      Hours: {record.totalHours} hrs
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamCalendar;

