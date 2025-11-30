# Attendify - Employee Attendance System

A full-stack web application for tracking employee attendance with role-based access control for employees and managers.

## attendify-screenshot

![image alt](https://github.com/hariharangnanasekar/attendify/blob/master/attendify_screenshots/Screenshot_30-11-2025_75723_localhost.jpeg)

## Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features

### Employee Features
- User registration and login
- Daily check-in/check-out
- View personal attendance history (calendar and table views)
- Monthly attendance summary
- Dashboard with statistics
- Profile management

### Manager Features
- Manager login
- View all employees' attendance
- Filter attendance by employee, date range, and status
- Team attendance summary
- Export attendance reports to CSV
- Dashboard with team statistics and charts
- Team calendar view

## Project Structure

```
Attendify/
├── backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth and role middleware
│   │   ├── utils/       # Utility functions
│   │   └── seeders/     # Seed data script
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   ├── services/    # API service
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendify
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

5. (Optional) Seed the database with sample data:
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - Get attendance history
- `GET /api/attendance/my-summary` - Get monthly summary
- `GET /api/attendance/today` - Get today's status

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees' attendance
- `GET /api/attendance/employee/:id` - Get specific employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/export` - Export CSV
- `GET /api/attendance/today-status` - Get today's status for all employees

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/manager` - Manager dashboard stats

## Seed Data

The seed script creates:
- 2 managers
- 5 employees
- 30 days of sample attendance data

**Test Credentials:**

Manager:
- Email: `manager@attendify.com`
- Password: `manager123`

Employee:
- Email: `alice@attendify.com`
- Password: `employee123`

## Usage

1. **Employee Registration/Login**
   - Employees can register with their details
   - After registration, they can log in to access their dashboard

2. **Check In/Out**
   - Employees can check in when they arrive
   - Check out when they leave
   - System automatically calculates total hours and status

3. **View Attendance**
   - Employees can view their attendance history in calendar or table format
   - Filter by month and year

4. **Manager Dashboard**
   - Managers can view team statistics
   - See charts for attendance trends
   - View late arrivals and absent employees

5. **Reports**
   - Managers can filter attendance data
   - Export reports to CSV format

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

## Database Schema

### User Model
- `name` - User's full name
- `email` - Email address (unique)
- `password` - Hashed password
- `role` - User role (employee/manager)
- `employeeId` - Unique employee ID (for employees)
- `department` - Department name
- `createdAt` - Account creation date

### Attendance Model
- `userId` - Reference to User
- `date` - Attendance date
- `checkInTime` - Check-in timestamp
- `checkOutTime` - Check-out timestamp
- `status` - Attendance status (present/absent/late/half-day)
- `totalHours` - Total hours worked
- `createdAt` - Record creation date

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.

