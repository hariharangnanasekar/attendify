const User = require('../models/User');

const generateEmployeeId = async () => {
  try {
    const lastUser = await User.findOne({ employeeId: { $exists: true } })
      .sort({ employeeId: -1 })
      .exec();

    if (!lastUser || !lastUser.employeeId) {
      return 'EMP001';
    }

    const lastNumber = parseInt(lastUser.employeeId.replace('EMP', ''));
    const newNumber = lastNumber + 1;
    return `EMP${newNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating employee ID:', error);
    return `EMP${Date.now().toString().slice(-6)}`;
  }
};

module.exports = generateEmployeeId;

