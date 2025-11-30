const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    // Monthly summary
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const monthlyAttendance = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    monthlyAttendance.forEach((record) => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      summary.totalHours += record.totalHours || 0;
    });

    // Recent 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttendance = await Attendance.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today },
    })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      todayStatus: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'absent',
      },
      monthlySummary: summary,
      totalHours: parseFloat(summary.totalHours.toFixed(2)),
      recentAttendance: recentAttendance.map((record) => ({
        date: record.date,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        status: record.status,
        totalHours: record.totalHours,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
const getManagerDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate('userId', 'name employeeId department');

    const todayPresent = todayAttendance.filter((a) => a.status !== 'absent').length;
    const todayAbsent = totalEmployees - todayPresent;
    const lateArrivals = todayAttendance.filter((a) => a.status === 'late');

    // Weekly attendance trend (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAttendance = await Attendance.find({
      date: { $gte: sevenDaysAgo, $lte: today },
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayAttendance = weeklyAttendance.filter((a) => {
        const aDate = new Date(a.date);
        aDate.setHours(0, 0, 0, 0);
        return aDate.getTime() === date.getTime();
      });

      weeklyTrend.push({
        date: date.toISOString().split('T')[0],
        present: dayAttendance.filter((a) => a.status !== 'absent').length,
        total: totalEmployees,
      });
    }

    // Department-wise attendance
    const employees = await User.find({ role: 'employee' });
    const departmentStats = {};

    employees.forEach((emp) => {
      if (!departmentStats[emp.department]) {
        departmentStats[emp.department] = { total: 0, present: 0 };
      }
      departmentStats[emp.department].total++;
    });

    todayAttendance.forEach((att) => {
      const dept = att.userId?.department || 'General';
      if (departmentStats[dept] && att.status !== 'absent') {
        departmentStats[dept].present++;
      }
    });

    const departmentWise = Object.entries(departmentStats).map(([dept, stats]) => ({
      department: dept,
      total: stats.total,
      present: stats.present,
      absent: stats.total - stats.present,
    }));

    // Absent employees today
    const allEmployeeIds = employees.map((e) => e._id.toString());
    const presentEmployeeIds = todayAttendance
      .filter((a) => a.status !== 'absent')
      .map((a) => a.userId._id.toString());
    const absentEmployeeIds = allEmployeeIds.filter((id) => !presentEmployeeIds.includes(id));

    const absentEmployees = employees
      .filter((e) => absentEmployeeIds.includes(e._id.toString()))
      .map((e) => ({
        _id: e._id,
        name: e.name,
        employeeId: e.employeeId,
        department: e.department,
      }));

    res.json({
      totalEmployees,
      todayAttendance: {
        present: todayPresent,
        absent: todayAbsent,
      },
      lateArrivals: lateArrivals.map((a) => ({
        _id: a.userId._id,
        name: a.userId.name,
        employeeId: a.userId.employeeId,
        department: a.userId.department,
        checkInTime: a.checkInTime,
      })),
      weeklyTrend,
      departmentWise,
      absentEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployeeDashboard,
  getManagerDashboard,
};

