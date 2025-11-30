const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
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
} = require('../controllers/attendanceController');

// Employee routes
router.post('/checkin', protect, roleCheck('employee'), checkIn);
router.post('/checkout', protect, roleCheck('employee'), checkOut);
router.get('/my-history', protect, roleCheck('employee'), getMyHistory);
router.get('/my-summary', protect, roleCheck('employee'), getMySummary);
router.get('/today', protect, roleCheck('employee'), getTodayStatus);

// Manager routes
router.get('/all', protect, roleCheck('manager'), getAllAttendance);
router.get('/employee/:id', protect, roleCheck('manager'), getEmployeeAttendance);
router.get('/summary', protect, roleCheck('manager'), getTeamSummary);
router.get('/export', protect, roleCheck('manager'), exportAttendance);
router.get('/today-status', protect, roleCheck('manager'), getTodayStatusAll);

module.exports = router;

