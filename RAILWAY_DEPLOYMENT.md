# Railway Deployment Guide for TAXA Platform

## 🚂 What We'll Deploy

```
Railway Project:
├── Backend Service (FastAPI)
├── PostgreSQL Database
└── MinIO Storage (or use Railway volumes)

Vercel:
└── Frontend (Next.js)
```

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

**Free Tier:** $5 credit/month (enough for small apps)

---

## Step 2: Deploy Backend to Railway

### Option A: Using Railway Dashboard (Easiest)

1. **Go to Railway Dashboard:**
   - https://railway.app/dashboard

2. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your **`Taxa`** repository

3. **Configure Service:**
   - Railway will detect your Docker setup
   - Root Directory: Leave as `/` (it will use docker-compose)
   
4. **Add Database:**
   - In your project, click **"New"** → **"Database"** → **"PostgreSQL"**
   - Railway creates database automatically
   - Note the connection details

5. **Add Environment Variables:**
   Click on your backend service → **"Variables"** tab:

   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-filled by Railway
   SECRET_KEY=your-super-secret-key-change-this
   OPENAI_API_KEY=your_openai_key
   MINDEE_API_KEY=your_mindee_key
   VERYFI_CLIENT_ID=your_veryfi_client_id
   VERYFI_API_KEY=your_veryfi_key
   KLIPPA_API_KEY=your_klippa_key
   PORT=8000
   ```

6. **Deploy:**
   - Railway automatically deploys
   - Wait 3-5 minutes
   - Get your backend URL: `https://your-service.railway.app`

---

### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

---

## Step 3: Configure Database Connection

Railway provides PostgreSQL automatically. Your backend will connect using the `DATABASE_URL` environment variable.

**Railway sets this automatically:**
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:7432/railway
```

**No code changes needed!** Your FastAPI already uses this variable.

---

## Step 4: Handle File Storage

### Option 1: Railway Volumes (Simple)
1. In Railway dashboard → Your backend service
2. Click **"Settings"** → **"Volumes"**
3. Add volume: `/app/storage` → 1GB
4. Files persist across deployments

### Option 2: External Storage (Recommended for Production)
- Use **Cloudflare R2** (10GB free)
- Use **AWS S3**
- Update MinIO configuration in your backend

---

## Step 5: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - https://vercel.com/new

2. **Import Repository:**
   - Select `Taxa` repository
   - Root Directory: `frontend`
   - Framework: Next.js

3. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
   Replace with your actual Railway backend URL

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get URL: `https://taxa-platform.vercel.app`

---

## Step 6: Update CORS in Backend

Once you have your Vercel URL, update backend CORS:

**In `backend/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://taxa-platform.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Commit and push:**
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push origin main
```

Railway will automatically redeploy!

---

## Step 7: Test Your Deployment

1. **Visit your Vercel URL:**
   `https://taxa-platform.vercel.app`

2. **Test features:**
   - ✅ Landing page loads
   - ✅ Register new account
   - ✅ Login works
   - ✅ Dashboard shows
   - ✅ Upload documents
   - ✅ AI chat works

---

## Environment Variables Summary

### Railway (Backend):
```bash
# Auto-configured by Railway
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=8000

# You need to add these
SECRET_KEY=your-secret-key-min-32-characters
OPENAI_API_KEY=sk-...                    # Optional for AI chat
MINDEE_API_KEY=...                       # Optional for OCR
VERYFI_CLIENT_ID=...                     # Optional for OCR
VERYFI_API_KEY=...                       # Optional for OCR
KLIPPA_API_KEY=...                       # Optional for OCR
```

### Vercel (Frontend):
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## Monitoring & Logs

### Railway Logs:
1. Go to Railway dashboard
2. Click on your service
3. Click **"Deployments"** tab
4. Click on latest deployment
5. View real-time logs

### Vercel Logs:
1. Go to Vercel dashboard
2. Click on your project
3. Click **"Deployments"**
4. Click on deployment
5. View logs

---

## Cost Breakdown

### Railway Free Tier:
- **$5 credit/month**
- Usage-based: ~$5-10/month for small apps
- **500 hours of execution time**
- Enough for development & small production

### Vercel Free Tier:
- **100 GB bandwidth**
- **Unlimited deployments**
- **Free SSL**
- Perfect for your frontend

**Total: ~$0-5/month for hobby projects**

---

## Troubleshooting

### Backend won't start:
```bash
# Check Railway logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port binding issue
```

### Frontend can't connect to backend:
```bash
# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Should be your Railway URL, not localhost
# Redeploy frontend after changing variables
```

### Database errors:
```bash
# Railway provides PostgreSQL automatically
# Check DATABASE_URL is set
# Format: postgresql://user:pass@host:port/db
```

---

## Auto-Deployment Setup ✅

**Good news:** Both Railway and Vercel auto-deploy!

### Railway:
- Every push to `main` → Auto-deploys backend
- Configure in Railway → Settings → Service

### Vercel:
- Every push to `main` → Auto-deploys frontend
- Preview deployments for other branches

---

## Quick Deploy Commands

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Both Railway and Vercel deploy automatically!
# Check status:
# Railway: https://railway.app/dashboard
# Vercel: https://vercel.com/dashboard
```

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Configure monitoring/alerts
3. ✅ Set up backup strategy
4. ✅ Add production error tracking (Sentry)
5. ✅ Performance monitoring

---

## Support Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Vercel Docs:** https://vercel.com/docs
- **Your Backend URL:** Check Railway dashboard
- **Your Frontend URL:** Check Vercel dashboard
