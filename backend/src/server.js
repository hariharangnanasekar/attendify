const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, retryConnection } = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database (non-blocking - server will start even if DB fails)
connectDB().then((connected) => {
  if (!connected) {
    console.log('\n⚠️  Starting server without database connection...');
    console.log('⚠️  API endpoints will return errors until MongoDB is connected.\n');
    // Optionally retry connection in background
    setTimeout(() => {
      retryConnection(3, 10000); // Retry 3 times with 10 second delay
    }, 30000); // Wait 30 seconds before first retry
  }
}).catch((err) => {
  console.error('Database connection error:', err);
  console.log('\n⚠️  Starting server anyway...\n');
});

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins temporarily for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

