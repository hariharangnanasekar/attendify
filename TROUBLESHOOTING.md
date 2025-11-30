# Troubleshooting: "Cannot connect to server" Error

## ✅ Backend is Running - But Still Getting Error?

If the backend is running but you still see the error, try these steps:

### Step 1: Restart the Backend
The CORS configuration was updated. You need to restart the backend:

1. **In the backend terminal window**, press `Ctrl + C` to stop the server
2. **Start it again** with: `npm run dev`
3. **Wait** until you see: `Server running on port 5000`

### Step 2: Clear Browser Cache
1. **Press `Ctrl + Shift + Delete`** in your browser
2. **Clear cached images and files**
3. **Or use Incognito/Private mode** to test

### Step 3: Hard Refresh the Frontend
1. **Press `Ctrl + Shift + R`** (or `Ctrl + F5`) to hard refresh
2. **Or close and reopen** the browser tab

### Step 4: Check Browser Console
1. **Press `F12`** to open Developer Tools
2. **Go to Console tab**
3. **Look for any red error messages**
4. **Try logging in again** and watch the console

### Step 5: Verify Backend is Accessible
Open a new browser tab and go to:
**http://localhost:5000/api/health**

You should see: `{"message":"Server is running"}`

If you see an error, the backend is not running properly.

### Step 6: Check Both Terminals
Make sure you have **TWO terminal windows open**:

1. **Backend Terminal** (port 5000) - Should show:
   ```
   MongoDB Connected: ...
   Server running on port 5000
   ```

2. **Frontend Terminal** (port 3000) - Should show:
   ```
   VITE v4.x.x ready
   Local: http://localhost:3000/
   ```

### Step 7: Check for MongoDB Errors
In the backend terminal, look for:
- ✅ `MongoDB Connected: ...` (Good!)
- ❌ `MongoDB Connection Error` (Problem!)

If you see MongoDB errors, check your `.env` file.

### Step 8: Try Different Browser
Sometimes browser extensions or settings can block requests. Try:
- Chrome
- Firefox
- Edge
- Or use Incognito/Private mode

### Step 9: Check Firewall/Antivirus
Your firewall or antivirus might be blocking port 5000. Try:
- Temporarily disable firewall
- Add exception for Node.js
- Check Windows Firewall settings

### Step 10: Verify Ports
Make sure nothing else is using port 5000:
```powershell
netstat -ano | findstr :5000
```

If you see multiple entries, something else is using the port.

## Still Not Working?

1. **Check the backend terminal** for any error messages
2. **Check the browser console** (F12) for detailed errors
3. **Share the exact error message** you see in the console

## Quick Test

1. Backend running? → http://localhost:5000/api/health
2. Frontend running? → http://localhost:3000
3. Both running? → Try login again
4. Still error? → Check console (F12) and backend terminal

