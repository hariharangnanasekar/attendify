# How to Start the Backend Server

## Quick Start

1. **Open a new terminal/PowerShell window**

2. **Navigate to the backend folder:**
   ```powershell
   cd C:\Users\HARIHARAN\Desktop\Attendify\backend
   ```

3. **Start the server:**
   ```powershell
   npm run dev
   ```

4. **You should see:**
   ```
   MongoDB Connected: ...
   Server running on port 5000
   ```

5. **Keep this terminal window open** - the server needs to keep running

## Troubleshooting

### If you see "MongoDB connection error":
- Make sure MongoDB is running
- Check your `.env` file has the correct `MONGODB_URI`
- For MongoDB Atlas, make sure your IP is whitelisted

### If you see "Port 5000 already in use":
- Another process is using port 5000
- Change the PORT in `.env` file to something else (e.g., 5001)
- Update frontend `.env` to match: `VITE_API_URL=http://localhost:5001/api`

### To stop the server:
- Press `Ctrl + C` in the terminal where it's running

## Verify Backend is Running

Open your browser and go to: http://localhost:5000/api/health

You should see: `{"message":"Server is running"}`

