const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const exportAttendanceToCSV = async (attendanceData, filePath) => {
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: 'employeeId', title: 'Employee ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'department', title: 'Department' },
      { id: 'date', title: 'Date' },
      { id: 'checkInTime', title: 'Check In' },
      { id: 'checkOutTime', title: 'Check Out' },
      { id: 'status', title: 'Status' },
      { id: 'totalHours', title: 'Total Hours' },
    ],
  });

  await csvWriter.writeRecords(attendanceData);
  return filePath;
};

module.exports = exportAttendanceToCSV;

