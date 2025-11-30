# 🚀 How to Start the Backend Server

## The Problem
Your frontend cannot connect because the **backend server is not running**.

## Solution: Start the Backend

### Option 1: Using the Batch File (Easiest - Windows)

1. **Double-click** the file: `backend/start-server.bat`
2. A terminal window will open and start the server
3. **Keep that window open** while using the app
4. You should see: `Server running on port 5000`

### Option 2: Using PowerShell/Terminal

1. **Open a NEW terminal/PowerShell window** (keep it separate from frontend)

2. **Navigate to backend folder:**
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

5. **Keep this terminal open** - don't close it!

## Verify Backend is Running

After starting, open your browser and go to:
**http://localhost:5000/api/health**

You should see: `{"message":"Server is running"}`

## Important Notes

- ✅ **Backend must be running** for the frontend to work
- ✅ **Keep the backend terminal open** while using the app
- ✅ You need **TWO terminals**: one for backend, one for frontend
- ❌ Don't close the backend terminal while using the app

## Troubleshooting

### If you see "MongoDB connection error":
- Check your `backend/.env` file
- Make sure `MONGODB_URI` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### If you see "Port 5000 already in use":
- Another program is using port 5000
- Change PORT in `backend/.env` to 5001
- Update frontend API URL if needed

### If the server won't start:
- Make sure you're in the `backend` folder
- Run `npm install` first
- Check that `.env` file exists

## Quick Test

Once backend is running, try logging in again in your browser at http://localhost:3000

