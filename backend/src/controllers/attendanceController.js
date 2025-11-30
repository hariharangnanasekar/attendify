const Attendance = require('../models/Attendance');
const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;
const exportAttendanceToCSV = require('../utils/csvExport');

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const checkInHour = checkInTime.getHours();
    const checkInMinute = checkInTime.getMinutes();

    // Determine status: late if check-in is after 9:30 AM
    let status = 'present';
    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
      status = 'late';
    }

    let attendance;
    if (existingAttendance) {
      attendance = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        {
          checkInTime,
          status,
        },
        { new: true }
      );
    } else {
      attendance = await Attendance.create({
        userId,
        date: today,
        checkInTime,
        status,
      });
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);

    // Update status to half-day if less than 4 hours
    let status = attendance.status;
    if (totalHours < 4) {
      status = 'half-day';
    }

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = parseFloat(totalHours.toFixed(2));
    attendance.status = status;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private (Employee)
const getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    let query = { userId };
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary
// @access  Private (Employee)
const getMySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    attendance.forEach((record) => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      summary.totalHours += record.totalHours || 0;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private (Employee)
const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        checkInTime: null,
        checkOutTime: null,
        status: 'absent',
      });
    }

    res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      status: attendance.status,
      totalHours: attendance.totalHours,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees attendance
// @route   GET /api/attendance/all
// @access  Private (Manager)
const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, status } = req.query;

    let query = {};
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific employee attendance
// @route   GET /api/attendance/employee/:id
// @access  Private (Manager)
const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let query = { userId: id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team summary
// @route   GET /api/attendance/summary
// @access  Private (Manager)
const getTeamSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate('userId', 'name employeeId department');

    const summary = {
      totalEmployees: await User.countDocuments({ role: 'employee' }),
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    attendance.forEach((record) => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      summary.totalHours += record.totalHours || 0;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export attendance to CSV
// @route   GET /api/attendance/export
// @access  Private (Manager)
const exportAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;

    let query = {};
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    if (attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for the selected criteria' });
    }

    const csvData = attendance.map((record) => ({
      employeeId: record.userId?.employeeId || 'N/A',
      name: record.userId?.name || 'N/A',
      email: record.userId?.email || 'N/A',
      department: record.userId?.department || 'N/A',
      date: record.date.toISOString().split('T')[0],
      checkInTime: record.checkInTime
        ? new Date(record.checkInTime).toLocaleString()
        : 'N/A',
      checkOutTime: record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleString()
        : 'N/A',
      status: record.status,
      totalHours: record.totalHours || 0,
    }));

    const filePath = path.join(__dirname, '../../temp', `attendance_${Date.now()}.csv`);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await exportAttendanceToCSV(csvData, filePath);

    res.download(filePath, `attendance_${Date.now()}.csv`, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      // Clean up file after download
      fs.unlink(filePath).catch(console.error);
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: error.message || 'Failed to export CSV' });
  }
};

// @desc    Get today's attendance status for all employees
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
const getTodayStatusAll = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate('userId', 'name email employeeId department');

    const allEmployees = await User.find({ role: 'employee' });
    const employeeMap = new Map();

    allEmployees.forEach((emp) => {
      employeeMap.set(emp._id.toString(), {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        employeeId: emp.employeeId,
        department: emp.department,
        checkedIn: false,
        checkedOut: false,
        checkInTime: null,
        checkOutTime: null,
        status: 'absent',
      });
    });

    attendance.forEach((record) => {
      const empId = record.userId._id.toString();
      if (employeeMap.has(empId)) {
        const emp = employeeMap.get(empId);
        emp.checkedIn = !!record.checkInTime;
        emp.checkedOut = !!record.checkOutTime;
        emp.checkInTime = record.checkInTime;
        emp.checkOutTime = record.checkOutTime;
        emp.status = record.status;
      }
    });

    res.json(Array.from(employeeMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendance,
  getTodayStatusAll,
};

