# Google Sheets Setup Guide

This guide will walk you through setting up Google Sheets as the database for Jeyam Fancy Store.

## Prerequisites

- A Google account
- Node.js installed on your system
- Basic knowledge of Google Cloud Console

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Jeyam Fancy Store Database" (or any name you prefer)
4. **Copy the Sheet ID from the URL**
   - The URL will look like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Copy the `YOUR_SHEET_ID` part

---

## Step 2: Create Categories Sheet

1. In your Google Sheet, rename the first sheet to **"Categories"**
2. In row 1, add the following headers:
   ```
   id | name | createdAt
   ```
3. Add a few sample categories:
   ```
   id              | name              | createdAt
   cat-1           | Watches           | 2026-01-01
   cat-2           | Photo Frame       | 2026-01-01
   cat-3           | Ring              | 2026-01-01
   ```

---

## Step 3: Create Products Sheet

1. Click the "+" button at the bottom to add a new sheet
2. Rename it to **"Products"**
3. In row 1, add the following headers:
   ```
   id | name | categoryId | price | imageUrl | stock | description | createdAt
   ```
4. Add a few sample products:
   ```
   id          | name                | categoryId | price | imageUrl                                    | stock      | description | createdAt
   item-1-1    | Classic Analog Watch| cat-1      | 1200  | https://images.unsplash.com/photo-...      | In Stock   |             | 2026-01-01
   item-2-1    | Wooden Photo Frame  | cat-2      | 500   | https://images.unsplash.com/photo-...      | In Stock   |             | 2026-01-01
   ```

**Important Notes:**
- The `id` column should contain unique identifiers
- The `categoryId` must match an existing category ID from the Categories sheet
- The `stock` column can contain: "In Stock", "Out of Stock", "Available Soon", "Available in 2 days", "Available in 7 days"
- The `imageUrl` should be a valid image URL
- The `price` should be a number (without currency symbols)

---

## Step 4: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Jeyam Fancy Store")
5. Click **"Create"**
6. Wait for the project to be created, then select it

---

## Step 5: Enable Google Sheets API

1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Sheets API"**
3. Click on it and click **"Enable"**
4. Wait for the API to be enabled

---

## Step 6: Create Service Account

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "Service Account"**
3. Enter a name (e.g., "jeyam-fancy-store-service")
4. Click **"Create and Continue"**
5. Skip the optional steps and click **"Done"**

---

## Step 7: Generate Credentials JSON

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the **"Keys"** tab
4. Click **"Add Key" > "Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**
7. A JSON file will be downloaded - **SAVE THIS FILE SECURELY**

The JSON file will look like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

## Step 8: Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click the **"Share"** button (top right)
3. In the "Add people and groups" field, paste the **service account email** from the JSON file
   - It will look like: `your-service-account@your-project-id.iam.gserviceaccount.com`
4. Set permission to **"Editor"**
5. **Uncheck** "Notify people" (service accounts don't have email)
6. Click **"Share"**

---

## Step 9: Configure Environment Variables

1. Navigate to the `backend` folder
2. Create a `.env` file (copy from `.env.example` if it exists)
3. Add the following variables:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your-sheet-id-from-step-1
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from JSON file\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Important Notes:**
- Replace `your-sheet-id-from-step-1` with the Sheet ID you copied in Step 1
- Replace `your-service-account@your-project-id.iam.gserviceaccount.com` with the `client_email` from the JSON file
- For `GOOGLE_PRIVATE_KEY`, copy the entire `private_key` value from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Keep the quotes around the private key value
- The `\n` characters in the private key are important - they represent newlines

**Example:**
```env
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SERVICE_ACCOUNT_EMAIL=jeyam-store@my-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## Step 10: Install Dependencies

1. Navigate to the project root:
   ```bash
   cd jeyam-fancy-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Step 11: Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```env
   GOOGLE_SHEET_ID=your-sheet-id-from-step-1
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

2. Replace the values with your actual credentials from Step 7

---

## Step 12: Start Next.js Development Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to: `http://localhost:3000`

3. The API routes will be available at:
   - `http://localhost:3000/api/products`
   - `http://localhost:3000/api/categories`

---

## Troubleshooting

### Error: "Failed to initialize Google Sheets service"

**Possible causes:**
- Incorrect `GOOGLE_SHEET_ID`
- Service account email doesn't have access to the sheet
- Incorrect `GOOGLE_PRIVATE_KEY` format
- Environment variables not set in Vercel (for production)

**Solutions:**
1. Verify the Sheet ID in the URL matches your `.env.local` file (or Vercel environment variables)
2. Make sure you shared the sheet with the service account email
3. Check that the private key includes the `\n` characters and is properly quoted
4. For Vercel deployment, ensure all environment variables are set in Project Settings

### Error: "Sheet 'Categories' not found"

**Solution:**
- Make sure the sheet is named exactly "Categories" (case-sensitive)
- Check that the sheet exists in your Google Sheet

### Error: "Row with id='...' not found"

**Solution:**
- Make sure the ID exists in the sheet
- Check for typos in the ID

### API returns empty arrays

**Possible causes:**
- Sheet headers don't match expected format
- No data in the sheets
- API route not working (check browser console)

**Solutions:**
1. Verify headers match exactly: `id | name | createdAt` for Categories
2. Verify headers match exactly: `id | name | categoryId | price | imageUrl | stock | description | createdAt` for Products
3. Add some sample data to test
4. Check browser console for API errors
5. Verify the API route is accessible: `http://localhost:3000/api/categories`

---

## Step 13: Testing the Setup

1. **Test Categories API:**
   ```bash
   curl http://localhost:3000/api/categories
   ```
   Should return your categories.

2. **Test Products API:**
   ```bash
   curl http://localhost:3000/api/products
   ```
   Should return your products.

3. **Test Frontend:**
   - Open `http://localhost:3000`
   - You should see your products and categories
   - Try adding/editing products in the admin panel

---

## Step 14: Deploy to Vercel

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings > Environment Variables
   - Add the following:
     - `GOOGLE_SHEET_ID`
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`
   - Use the same values from your `.env.local` file

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your Next.js app
   - Your app will be live at `https://your-project.vercel.app`

**Note:** The API routes work automatically in Vercel - no separate backend server needed!

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files to version control**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for documentation

2. **Keep your service account JSON file secure**
   - Don't share it publicly
   - Don't commit it to repositories

3. **In production:**
   - Use environment variables from your hosting platform
   - Consider using a secrets management service
   - Restrict service account permissions to only what's needed

---

## Next Steps

Once everything is set up:

1. ✅ Test creating a category via admin panel
2. ✅ Test creating a product via admin panel
3. ✅ Test editing products and categories
4. ✅ Test deleting categories (should delete associated products)
5. ✅ Verify data appears correctly in Google Sheets

---

## Support

If you encounter issues:

1. Check the Next.js development server console for error messages
2. Verify all environment variables are set correctly in `.env.local` (or Vercel)
3. Ensure the Google Sheet is shared with the service account
4. Test the API endpoints directly: `http://localhost:3000/api/categories` or `http://localhost:3000/api/products`
5. Check browser console for frontend errors
6. For Vercel deployment issues, check the Vercel deployment logs

---

**Congratulations!** 🎉 Your Next.js application with Google Sheets database is now set up and ready to use!

## Architecture Notes

- **No separate backend server needed** - All API routes are serverless functions in Next.js
- **Fully deployable on Vercel for free** - No Express server required
- **API routes work automatically** - Access at `/api/products` and `/api/categories`
- **Environment variables** - Set in `.env.local` for development, Vercel dashboard for production

