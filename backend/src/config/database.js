const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}\n`);
    
    // Provide helpful error messages for common issues
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('🔒 IP Whitelist Issue Detected!');
      console.error('\nTo fix this for MongoDB Atlas:');
      console.error('1. Go to: https://cloud.mongodb.com/');
      console.error('2. Select your cluster');
      console.error('3. Click "Network Access" in the left menu');
      console.error('4. Click "Add IP Address"');
      console.error('5. Click "Add Current IP Address" (or add 0.0.0.0/0 for all IPs - less secure)');
      console.error('6. Wait a few minutes for changes to take effect');
      console.error('\n⚠️  Server will continue running but database operations will fail.');
      console.error('⚠️  Fix the MongoDB connection and restart the server.\n');
    } else if (error.message.includes('authentication')) {
      console.error('🔐 Authentication Error!');
      console.error('Check your MongoDB username and password in the connection string.');
      console.error('\n⚠️  Server will continue running but database operations will fail.\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 Network Error!');
      console.error('Check your MongoDB connection string and internet connection.');
      console.error('\n⚠️  Server will continue running but database operations will fail.\n');
    } else {
      console.error('\n⚠️  Server will continue running but database operations will fail.\n');
    }
    
    // Don't exit - let the server start anyway
    // The API will return errors but at least the server won't crash
    isConnected = false;
    return false;
  }
};

// Retry connection function
const retryConnection = async (maxRetries = 5, delay = 5000) => {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`\n🔄 Retrying MongoDB connection (attempt ${i + 1}/${maxRetries})...`);
    const connected = await connectDB();
    if (connected) {
      return true;
    }
    if (i < maxRetries - 1) {
      console.log(`⏳ Waiting ${delay / 1000} seconds before retry...\n`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

module.exports = { connectDB, retryConnection, isConnected: () => isConnected };

