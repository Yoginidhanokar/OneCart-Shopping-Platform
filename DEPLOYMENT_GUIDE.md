# 🚀 OneCart Deployment & Login Fix Guide

## ✅ Issues Fixed

### 1. **Admin Login Response Format** 
- Fixed: `adminLogin` endpoint now returns `{ success: true, token, message }` instead of just the token
- Admin Login.jsx now properly stores token in localStorage

### 2. **Cookie Security Settings**
- Updated all endpoints to dynamically set `secure` flag based on environment:
  - `secure: false` on localhost (development)
  - `secure: true` on production (Render with HTTPS)
- This fixes the cookie issue on both local and deployed versions

### 3. **Token Storage & Authorization**
- Frontend & Admin both store token in localStorage after login
- Frontend uses `Authorization: Bearer {token}` header for protected requests
- Backend isAuth middleware validates the Bearer token

---

## 🔧 Testing Locally

### 1. **Backend Setup**
```bash
cd backend
npm install
# Make sure .env file has these variables:
# PORT=8000
# MONGODB_URL=your_mongodb_url
# JWT_SECRET=your_secret
# ADMIN_EMAIL=admin@onecart.com
# ADMIN_PASSWORD=admin1234567
# NODE_ENV=development  # Important!

npm start
```

### 2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
# Login test with any registered user
```

### 3. **Admin Setup**
```bash
cd admin
npm install
npm run dev
# Admin runs on http://localhost:5174 (or next available port)
# Login with: admin@onecart.com / admin1234567
```

---

## 🌐 Deploying to Render (Multiple Apps from One Repo)

You CAN deploy both frontend AND admin from the same GitHub repository! Here's how:

### **Option 1: Deploy as Separate Services (Recommended)**

Create **TWO** separate web services on Render:

#### **Service 1: Backend**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. New → Web Service → Connect GitHub repo
3. Configure:
   - **Name**: `onecart-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=8000
     MONGODB_URL=your_url
     JWT_SECRET=your_secret
     ADMIN_EMAIL=admin@onecart.com
     ADMIN_PASSWORD=admin1234567
     ```

#### **Service 2: Frontend**
1. New → Web Service → Connect GitHub repo
2. Configure:
   - **Name**: `onecart-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: (none needed, uses production serverUrl from code)

#### **Service 3: Admin**
1. New → Web Service → Connect GitHub repo
2. Configure:
   - **Name**: `onecart-admin`
   - **Root Directory**: `admin`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: (none needed)

---

### **Update Frontend & Admin AuthContext**

Once deployed, update the serverUrl in both apps:

**frontend/src/context/AuthContext.jsx:**
```javascript
const serverUrl = process.env.NODE_ENV === 'development'
    ? ''
    : 'https://onecart-backend-xxxx.onrender.com';  // Your actual backend URL
```

**admin/src/context/AuthContext.jsx:**
```javascript
const serverUrl = process.env.NODE_ENV === 'development'
    ? ''
    : 'https://onecart-backend-xxxx.onrender.com';  // Same backend URL
```

---

### **Update Backend CORS**

Update `backend/index.js` with your deployed URLs:

```javascript
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://onecart-frontend-xxxx.onrender.com",
    "https://onecart-admin-xxxx.onrender.com"
];
```

---

## 🔑 GitHub Repository Structure

Your GitHub should have:
```
OneCart/
├── backend/
├── frontend/
├── admin/
├── .gitignore
└── README.md
```

✅ **You have ONE GitHub repo, but MULTIPLE Render services** pointing to different directories!

---

## 🧪 Testing Login After Deployment

### **Frontend Login:**
1. Go to `https://onecart-frontend-xxxx.onrender.com`
2. Register or login with a user account
3. Check browser console → Network tab for API requests
4. Verify token is in localStorage

### **Admin Login:**
1. Go to `https://onecart-admin-xxxx.onrender.com`
2. Login with: `admin@onecart.com` / `admin1234567`
3. Check browser console for any errors
4. Verify token is in localStorage

### **Debugging Failed Login:**
```bash
# Check backend logs in Render Dashboard
# Look for:
# - CORS errors
# - Token generation errors
# - Database connection issues
# - Check that .env variables are set correctly
```

---

## ⚠️ Common Render Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS error on production | Add your Render URLs to backend CORS allowedOrigins |
| 401 Unauthorized | Check JWT_SECRET matches across all services |
| Login page hangs | Check network tab - backend might be sleeping (upgrade free tier) |
| Admin login returns wrong response | Make sure backend is updated with new adminLogin endpoint |
| Token not persisting | Check if localStorage is being saved (dev tools → Application) |

---

## 📝 GitHub Link in Profile

Since you have ONE repository with multiple services:
- **Add GitHub link to repo** (not individual services)
- Mention in README.md that there are 3 services:
  - Frontend: `https://onecart-frontend-xxx.onrender.com`
  - Admin: `https://onecart-admin-xxx.onrender.com`
  - Backend API: `https://onecart-backend-xxx.onrender.com`

---

## 🎯 Next Steps

1. ✅ Push all changes to GitHub
2. ✅ Set up 3 services on Render (backend, frontend, admin)
3. ✅ Update AuthContext with correct backend URL
4. ✅ Update backend CORS with frontend & admin URLs
5. ✅ Test login on all deployed services
6. ✅ Monitor Render logs for any errors
