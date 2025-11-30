const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'absent',
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate attendance for same user on same date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for faster queries
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ userId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

