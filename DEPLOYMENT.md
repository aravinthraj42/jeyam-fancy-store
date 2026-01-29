# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `aravinthraj42/jeyam-fancy-store`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live! 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Vercel Configuration

The `vercel.json` file is already configured with:

- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing (all routes redirect to index.html)
- ✅ Framework: Vite

## Environment Variables

No environment variables needed for this project (all data is stored in localStorage).

## Post-Deployment

After deployment:

1. **Test the app**
   - Visit your Vercel URL
   - Test guest browsing
   - Test login (admin1/admin123)
   - Test admin panel
   - Test WhatsApp ordering

2. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Routing Issues
- The `vercel.json` already includes SPA rewrites
- All routes should redirect to `index.html`

### Performance
- Vercel automatically optimizes static assets
- Images are served via CDN
- No additional configuration needed

## Support

For issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check build logs in Vercel dashboard
- Verify all files are committed to GitHub

