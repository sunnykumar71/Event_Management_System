# Event Management System - Frontend

React + Vite.js + Tailwind CSS frontend for the Event Management System.

## Tech Stack

- **React 18** - UI library
- **Vite.js** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites
- Node.js 18+
- Backend server running (port 5001)

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will run on http://localhost:5173

### Build

```bash
npm run build
```

## Features

### Authentication
- Admin Login/Signup
- Vendor Login/Signup
- User Login/Signup
- JWT-based authentication
- Protected routes

### Admin Module
- Dashboard
- User Management (CRUD)
- Vendor Management (CRUD)
- Membership Management (Add/Update)

### Vendor Module
- Dashboard
- Add/Manage Products
- View Transactions
- Handle Product Requests

### User Module
- User Portal
- View Vendors & Products
- Cart & Checkout
- Guest List Management
- Order Status Tracking
- Request Custom Products

## Project Structure

```
src/
├── components/       # Reusable components
├── context/          # React contexts
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   ├── admin/        # Admin pages
│   ├── vendor/       # Vendor pages
│   └── user/         # User pages
├── services/         # API services
├── utils/            # Utility functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## API Integration

The frontend connects to the backend API at `http://localhost:5001/api`.

Make sure the backend server is running before starting the frontend.
