const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('\n❌ Error: MONGODB_URI is not set in .env file');
      console.error('Please create a .env file in the backend directory with:');
      console.error('MONGODB_URI=mongodb://localhost:27017/attendify');
      console.error('(or your MongoDB connection string)\n');
      process.exit(1);
    }

    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Cleared existing data');

    // Create managers
    const manager1 = await User.create({
      name: 'John Manager',
      email: 'manager@attendify.com',
      password: 'manager123',
      role: 'manager',
      department: 'Management',
    });

    const manager2 = await User.create({
      name: 'Sarah Admin',
      email: 'admin@attendify.com',
      password: 'admin123',
      role: 'manager',
      department: 'HR',
    });

    console.log('Created managers');

    // Create employees
    const employees = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@attendify.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering',
      },
      {
        name: 'Bob Smith',
        email: 'bob@attendify.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'Engineering',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@attendify.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Marketing',
      },
      {
        name: 'Diana Prince',
        email: 'diana@attendify.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP004',
        department: 'Sales',
      },
      {
        name: 'Eve Wilson',
        email: 'eve@attendify.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP005',
        department: 'Engineering',
      },
    ]);

    console.log('Created employees');

    // Generate attendance data for the last 30 days
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Skip weekends (optional - you can remove this if you want weekend data)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      for (const employee of employees) {
        // Randomly decide if employee is present (80% chance)
        const isPresent = Math.random() > 0.2;

        if (isPresent) {
          // Random check-in time between 8:00 AM and 10:00 AM
          const checkInHour = 8 + Math.floor(Math.random() * 2);
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkInTime = new Date(date);
          checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

          // Determine status
          let status = 'present';
          if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
            status = 'late';
          }

          // Random check-out time between 5:00 PM and 7:00 PM
          const checkOutHour = 17 + Math.floor(Math.random() * 2);
          const checkOutMinute = Math.floor(Math.random() * 60);
          const checkOutTime = new Date(date);
          checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

          const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

          // Update status to half-day if less than 4 hours
          if (totalHours < 4) {
            status = 'half-day';
          }

          attendanceRecords.push({
            userId: employee._id,
            date,
            checkInTime,
            checkOutTime,
            status,
            totalHours: parseFloat(totalHours.toFixed(2)),
          });
        } else {
          // Absent
          attendanceRecords.push({
            userId: employee._id,
            date,
            status: 'absent',
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    console.log('\n=== Seed Data Summary ===');
    console.log(`Managers: 2`);
    console.log(`Employees: ${employees.length}`);
    console.log(`Attendance Records: ${attendanceRecords.length}`);
    console.log('\n=== Test Credentials ===');
    console.log('Manager: manager@attendify.com / manager123');
    console.log('Employee: alice@attendify.com / employee123');
    console.log('\nSeed data created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

