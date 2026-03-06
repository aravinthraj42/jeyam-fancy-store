# Deployment Guide - Vercel

This guide will help you deploy the Jeyam Fancy Store application to Vercel.

## Prerequisites

1. ✅ Google Sheet created and configured (see `GOOGLE_SHEET_SETUP.md`)
2. ✅ Google Service Account created with credentials
3. ✅ Google Sheet shared with service account email
4. ✅ GitHub account (for version control)

## Step 1: Prepare Your Code

### 1.1 Verify Project Structure

Ensure your project has the following structure:
```
jeyam-fancy-store/
├── app/
├── lib/
├── src/
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
└── .gitignore
```

### 1.2 Test Locally

```bash
# Install dependencies
npm install

# Create .env.local file (see .env.example)
cp .env.example .env.local
# Edit .env.local with your credentials

# Test the build
npm run build

# Test production server
npm run start
```

If the build succeeds, you're ready to deploy!

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Next.js e-commerce with Google Sheets"
```

### 2.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `jeyam-fancy-store` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/jeyam-fancy-store.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or login with your GitHub account
3. Authorize Vercel to access your GitHub repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your `jeyam-fancy-store` repository
3. Click **"Import"**

### 3.3 Configure Project

Vercel will auto-detect Next.js. You can use default settings:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 3.4 Add Environment Variables

**IMPORTANT:** Add these environment variables in Vercel:

1. Click **"Environment Variables"** section
2. Add each variable:

   ```
   GOOGLE_SHEET_ID
   Value: your-google-sheet-id
   
   GOOGLE_SERVICE_ACCOUNT_EMAIL
   Value: your-service-account@project.iam.gserviceaccount.com
   
   GOOGLE_PRIVATE_KEY
   Value: -----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n
   ```

   **Note:** For `GOOGLE_PRIVATE_KEY`, paste the entire key including:
   - The `-----BEGIN PRIVATE KEY-----` line
   - All the key content
   - The `-----END PRIVATE KEY-----` line
   - Keep the `\n` characters (they represent newlines)

3. Select **"Production"**, **"Preview"**, and **"Development"** for each variable
4. Click **"Save"**

### 3.5 Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 4: Verify Deployment

### 4.1 Test Your Application

1. Visit your Vercel URL
2. Test the home page (should load products)
3. Test the cart functionality
4. Test admin login at `/admin/login`
5. Test product/category management

### 4.2 Check Logs

If something doesn't work:

1. Go to your Vercel dashboard
2. Click on your project
3. Go to **"Deployments"** tab
4. Click on the latest deployment
5. Check **"Functions"** tab for API route logs
6. Check **"Runtime Logs"** for errors

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to your project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Error:** `Module not found` or `Cannot find module`
- **Solution:** Ensure all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

**Error:** `Environment variable not found`
- **Solution:** Verify all environment variables are set in Vercel
- Check variable names match exactly (case-sensitive)

### API Routes Return 500

**Error:** `Google Sheets API error`
- **Solution:** 
  - Verify `GOOGLE_SHEET_ID` is correct
  - Verify service account email has Editor access to the sheet
  - Check `GOOGLE_PRIVATE_KEY` format (must include newlines as `\n`)

**Error:** `Authentication error`
- **Solution:**
  - Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` is correct
  - Verify `GOOGLE_PRIVATE_KEY` is complete and properly formatted

### Products/Categories Not Loading

1. Check Vercel function logs
2. Verify Google Sheet structure matches expected format
3. Verify sheet names are exactly "Categories" and "Products" (case-sensitive)
4. Test API routes directly: `https://your-app.vercel.app/api/products`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_SHEET_ID` | Your Google Sheet ID from URL | `1a2b3c4d5e6f7g8h9i0j` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | `store@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Complete private key from JSON | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |

## Post-Deployment Checklist

- [ ] Home page loads products correctly
- [ ] Cart functionality works
- [ ] Admin login works
- [ ] Can create/edit/delete products
- [ ] Can create/edit/delete categories
- [ ] Stock status updates work
- [ ] Search and filter work
- [ ] WhatsApp order functionality works

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Main branch** → Production deployment
- **Other branches** → Preview deployments

Every push triggers a new deployment automatically!

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Review `GOOGLE_SHEET_SETUP.md` for Google Sheets configuration

---

**🎉 Congratulations! Your app is now live on Vercel!**

