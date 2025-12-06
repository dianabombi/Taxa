# Vercel Deployment Guide for TAXA Platform

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Backend deployed (Railway, Render, or similar)

## Step 1: Prepare Your Code

1. **Commit all changes to Git:**
```bash
cd /Users/diana/Downloads/TAXA
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Configure Vercel Project

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from the frontend directory:**
```bash
cd frontend
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? Y
   - Which scope? (select your account)
   - Link to existing project? N
   - Project name: taxa-platform
   - In which directory is your code located? ./
   - Want to override settings? N

### Option B: Using Vercel Dashboard

1. **Go to** https://vercel.com/new

2. **Import Git Repository:**
   - Click "Import Git Repository"
   - Connect your GitHub account
   - Select the `Taxa` repository

3. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Step 3: Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Required Variables:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
```

### Optional (if using features):
```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=your_database_url
```

## Step 4: Set Up Auto-Deployment

Vercel automatically sets up auto-deployment when you connect your GitHub repository:

1. **Every push to `main` branch** → Automatic production deployment
2. **Every push to other branches** → Automatic preview deployment
3. **Pull requests** → Automatic preview deployments

### Configuration:
- Go to Project Settings → Git
- Enable/disable auto-deployments
- Configure branch settings
- Set up deployment protection

## Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Wait for SSL certificate (automatic)

## Deployment Commands

### Deploy to Production:
```bash
vercel --prod
```

### Deploy Preview:
```bash
vercel
```

### Check Deployment Status:
```bash
vercel ls
```

### View Logs:
```bash
vercel logs
```

## Important Notes

### Frontend Only Deployment:
- This deployment only includes the Next.js frontend
- Backend must be deployed separately (Railway, Render, etc.)
- Update `NEXT_PUBLIC_API_BASE_URL` to point to your backend

### Build Settings:
- Node.js Version: 18.x (automatically detected)
- Package Manager: npm
- Build Output: .next directory

### Environment Variables:
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-side only
- Update variables in Vercel Dashboard after deployment

## Troubleshooting

### Build Fails:
```bash
# Check build locally first
cd frontend
npm run build
```

### API Connection Issues:
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS settings on your backend
- Ensure backend is deployed and accessible

### Environment Variables Not Working:
- Redeploy after adding/changing environment variables
- Check variable names match exactly
- Verify `NEXT_PUBLIC_` prefix for client-side variables

## Project Structure for Vercel

```
TAXA/
├── frontend/           # This gets deployed to Vercel
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── backend/           # Deploy separately
└── vercel.json       # Vercel configuration
```

## Monitoring

- View deployments: https://vercel.com/dashboard
- Check analytics: Project → Analytics
- Monitor performance: Project → Speed Insights
- View logs: Project → Logs

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Community: https://github.com/vercel/vercel/discussions
