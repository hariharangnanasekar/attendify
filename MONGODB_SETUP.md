# MongoDB Setup Guide

## MongoDB Atlas Connection Issues

If you're getting an IP whitelist error, follow these steps:

### Step 1: Whitelist Your IP Address

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster (or create one if you don't have one)
4. Click **"Network Access"** in the left sidebar
5. Click **"Add IP Address"** button
6. You have two options:
   - **Option A (Recommended for Development)**: Click **"Add Current IP Address"** - This adds only your current IP
   - **Option B (Less Secure)**: Add `0.0.0.0/0` - This allows access from anywhere (use only for development/testing)
7. Click **"Confirm"**
8. Wait 2-3 minutes for the changes to take effect

### Step 2: Verify Your Connection String

Make sure your `.env` file has the correct format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendify?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your MongoDB Atlas username
- Replace `password` with your MongoDB Atlas password (URL-encoded if it contains special characters)
- Replace `cluster0.xxxxx` with your actual cluster URL
- Make sure there are **NO spaces** and **NO quotes** around the value

### Step 3: Check Your Database User

1. In MongoDB Atlas, go to **"Database Access"** in the left sidebar
2. Make sure you have a database user created
3. The user should have read/write permissions
4. Use this username and password in your connection string

### Alternative: Use Local MongoDB

If you have MongoDB installed locally, you can use:

```env
MONGODB_URI=mongodb://localhost:27017/attendify
```

**To install MongoDB locally:**
- Windows: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Or use MongoDB via Docker

### Testing Your Connection

After whitelisting your IP, wait 2-3 minutes, then run:

```bash
npm run seed
```

If it still doesn't work, check:
1. Your IP address has been whitelisted (wait a few minutes)
2. Your connection string is correct
3. Your database user credentials are correct
4. Your internet connection is working

