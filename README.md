# Jeyam Fancy Store

A mobile-first e-commerce web application for a fancy store with WhatsApp ordering system and admin panel.

## Features

### Customer Features
- 🛍️ Browse products by category
- 🛒 Add items to cart
- 📱 Order via WhatsApp
- 📊 View stock status
- 💾 Cart persistence (localStorage)

### Admin Features
- 🔐 Secure login system
- 📦 Product management (CRUD)
- 📈 Stock status management
- 🔍 Search and filter products
- 💾 Data persistence (localStorage)

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **MUI Icons** - Icon library
- **Formik + Yup** - Form handling and validation
- **React Context** - State management

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Default Credentials

### Admin Login
- **Username:** `admin1`
- **Password:** `admin123`

### Staff Login
- **Username:** `staff1`
- **Password:** `staff123`

## Project Structure

```
src/
├── components/      # React components
├── context/         # React Context providers
├── data/           # JSON data files
├── utils/          # Utility functions
└── App.jsx         # Main app component
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite configuration
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

## License

Private project - All rights reserved
