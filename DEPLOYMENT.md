# TAXA Deployment Guide 🚀

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway.app account (free) OR Render.com account (free)

---

## 🎯 Step 1: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for production deployment"

# Push to GitHub
git push origin main
```

---

## 🖥️ Step 2: Deploy Backend (Choose ONE)

### Option A: Railway.app (Recommended - Easier)

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click**: "New Project" → "Deploy from GitHub repo"
4. **Select**: Your TAXA repository
5. **Root Directory**: Set to `backend`
6. **Add Environment Variables**:
   ```
   DATABASE_URL=sqlite:///./taxa.db
   SECRET_KEY=your-secure-random-key-here-change-this
   OCR_PROVIDER=mindee
   PORT=8080
   ```
7. **Deploy** - Railway will auto-detect Python and deploy!
8. **Copy your backend URL** (e.g., `https://taxa-backend-production.up.railway.app`)

### Option B: Render.com (Alternative)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click**: "New" → "Web Service"
4. **Connect** your TAXA repository
5. **Settings**:
   - **Name**: taxa-backend
   - **Root Directory**: backend
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Environment Variables**:
   ```
   DATABASE_URL=sqlite:///./taxa.db
   SECRET_KEY=your-secure-random-key-here
   OCR_PROVIDER=mindee
   PYTHON_VERSION=3.9
   ```
7. **Deploy** - Wait for build to complete
8. **Copy your backend URL** (e.g., `https://taxa-backend.onrender.com`)

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Click**: "Add New" → "Project"
4. **Import** your TAXA repository
5. **Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   
6. **Environment Variables** (CRITICAL):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url-from-step2.com
   ```
   ⚠️ **Replace with YOUR actual backend URL from Step 2!**

7. **Deploy** - Vercel will build and deploy automatically!

8. **Your TAXA app will be live at**: `https://taxa-xxxxx.vercel.app`

---

## 📱 Step 4: Access on Mobile

Once deployed, simply open your Vercel URL on your phone:
```
https://taxa-xxxxx.vercel.app
```

✅ Works on ANY device with internet!
✅ No localhost issues!
✅ Professional production URL!

---

## 🔒 Security Notes

**IMPORTANT**: Change these in production:
- Generate a secure SECRET_KEY (use: `openssl rand -hex 32`)
- Enable HTTPS only
- Set proper CORS origins in backend
- Never commit .env files with secrets

---

## 🔄 Future Updates

To update your deployment:

1. **Make changes locally**
2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. **Vercel & Railway auto-deploy** from GitHub! 🎉

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` environment variable in Vercel
- Make sure backend is running (check Railway/Render dashboard)
- Check backend logs for errors

### Backend deployment fails
- Check Python version (should be 3.9)
- Verify `requirements.txt` is in backend folder
- Check Railway/Render build logs

### Database issues
- SQLite works for testing but use PostgreSQL for production
- Railway provides free PostgreSQL
- Update DATABASE_URL environment variable

---

## 📞 Need Help?

Check the logs:
- **Vercel**: Dashboard → Your Project → Deployments → View Logs
- **Railway**: Dashboard → Your Service → Deployments → View Logs
- **Render**: Dashboard → Your Service → Logs

---

Made with ❤️ for TAXA
