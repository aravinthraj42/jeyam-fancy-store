# Jeyam Fancy Store

A modern e-commerce web application built with **Next.js 15** (App Router), using **Google Sheets** as the database. Fully deployable on **Vercel for free** with serverless API routes.

## 🏗️ Architecture

- **Frontend & Backend:** Next.js 15 (App Router) with API Routes (serverless functions)
- **Database:** Google Sheets (lightweight, no SQL required)
- **Deployment:** Vercel (free tier compatible)

## ✨ Features

### Customer Features
- 🛍️ Browse products by category
- 🛒 Add items to cart (localStorage persistence)
- 📱 Order via WhatsApp
- 📊 View stock status
- 🎨 Beautiful, responsive UI

### Admin Features
- 🔐 Secure login system
- 📦 **Product Management (CRUD)**
  - Create, edit, delete products
  - Update stock status
  - Change product categories
  - Upload image URLs
- 📁 **Category Management (CRUD)**
  - Create, edit, delete categories
  - Delete validation with product cascade
  - View category product counts
- 🔍 Search and filter products
- 💾 Real-time Google Sheets sync

## 📁 Project Structure

```
jeyam-fancy-store/
├── app/                    # Next.js App Router
│   ├── api/               # Serverless API routes
│   │   ├── products/      # Product API endpoints
│   │   └── categories/    # Category API endpoints
│   ├── admin/             # Admin pages
│   ├── cart/              # Cart page
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── lib/                    # Server-side utilities
│   ├── googleSheetService.js  # Google Sheets service
│   └── sheetConfig.js         # Sheet configuration
├── src/                    # Client-side code
│   ├── components/        # React components
│   ├── context/           # React Context providers
│   └── services/          # API client (uses fetch)
├── GOOGLE_SHEET_SETUP.md  # Google Sheets setup guide
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google account (for Google Sheets)
- Google Cloud project (for API access)

### ⚠️ Cleanup Old Files (First Time Setup)

If you're migrating from the old Vite version, delete these folders manually:
- `backend/` - Old Express backend
- `frontend/` - Duplicate frontend folder
- `dist/` - Old Vite build output
- `api/` - Old API structure
- `src/data/` - Static JSON data files

See `CLEANUP.md` for detailed cleanup instructions.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Google Sheets

Follow the detailed guide in [`GOOGLE_SHEET_SETUP.md`](./GOOGLE_SHEET_SETUP.md) to:
- Create Google Sheets
- Set up Google Cloud project
- Enable Google Sheets API
- Create service account
- Configure credentials

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_SHEET_ID=your-sheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Replace the values with your actual credentials from Google Cloud
- Keep the quotes around `GOOGLE_PRIVATE_KEY`
- The `\n` characters in the private key are important

### Step 4: Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Locally

### Test API Routes

Open your terminal and test the API endpoints:

```bash
# Test Categories API
curl http://localhost:3000/api/categories

# Test Products API
curl http://localhost:3000/api/products

# Create a test category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category"}'

# Create a test product (replace categoryId with actual ID)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "categoryId": "cat-1",
    "price": 1000,
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    "stock": "In Stock",
    "description": "Test description"
  }'
```

### Test Frontend

1. **Home Page:**
   - Visit `http://localhost:3000`
   - You should see products loaded from Google Sheets
   - Browse products by category
   - Add items to cart

2. **Cart Functionality:**
   - Click the cart button in header
   - Add/remove items
   - Fill customer details form
   - Test WhatsApp order (opens WhatsApp with order details)

3. **Admin Panel:**
   - Visit `http://localhost:3000/admin/login`
   - Login with credentials:
     - Username: `admin`
     - Password: `admin123`
   - Test CRUD operations:
     - Create a new category
     - Create a new product
     - Edit existing products/categories
     - Update stock status
     - Delete products
     - Delete category (should show confirmation modal)

### Test Category Delete Validation

1. Create a category with products
2. Try to delete the category
3. You should see a confirmation modal:
   - Shows warning about deleting associated products
   - Displays product count
   - Requires confirmation before deletion

### Verify Google Sheets Sync

1. Make changes in the admin panel
2. Open your Google Sheet
3. Verify changes appear in real-time
4. Test creating, updating, and deleting records

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Note:** Change these credentials in production!

## 📡 API Routes

All API routes are serverless functions in Next.js:

### Products
- `GET /api/products` - Get all products (optional `?categoryId=xxx` filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category (cascades to products)

## 🔒 Environment Variables

Create `.env.local` in the project root:

```env
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**For Vercel deployment:** Add these same variables in Project Settings > Environment Variables.

## 🚢 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in Project Settings
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

**That's it!** Your app will be live at `https://your-project.vercel.app`

## 🛠️ Tech Stack

### Frontend & Backend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Formik + Yup** - Form handling and validation
- **MUI Icons** - Icon library

### Database & APIs
- **Google Sheets API** - Database via googleapis package
- **Next.js API Routes** - Serverless backend functions

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete step-by-step guide for deploying to Vercel
- **[GOOGLE_SHEET_SETUP.md](./GOOGLE_SHEET_SETUP.md)** - Complete guide for setting up Google Sheets as database

## 🐛 Troubleshooting

### API Routes Return Errors

1. **Check environment variables:**
   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local
   ```

2. **Check Google Sheets access:**
   - Ensure the service account email has Editor access to the sheet
   - Verify sheet names are exactly "Categories" and "Products" (case-sensitive)

3. **Check server console:**
   - Look for error messages in the terminal where `npm run dev` is running

### Products/Categories Not Loading

1. **Verify Google Sheet structure:**
   - Categories sheet: headers must be `id | name | createdAt`
   - Products sheet: headers must be `id | name | categoryId | price | imageUrl | stock | description | createdAt`

2. **Test API directly:**
   ```bash
   curl http://localhost:3000/api/categories
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Check for JavaScript errors

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

## 🤝 Support

For setup issues:
1. Check `GOOGLE_SHEET_SETUP.md` for Google Sheets configuration
2. Verify environment variables are set correctly
3. Check Next.js development server console for errors
4. Ensure Google Sheet is shared with service account
5. For Vercel deployment, check deployment logs

## 📝 License

Private project - All rights reserved

---

**Built with ❤️ for Jeyam Fancy Store**

**Deployable on Vercel for free!** 🚀
