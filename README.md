#  Event Management System

A comprehensive, full-stack web application for managing events, vendors, and guests. Built with modern technologies and featuring role-based access control for Admins, Vendors, and Users.

![Event Management System](https://img.shields.io/badge/Event%20Management-Full%20Stack-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)



## ✨ Features

### 👑 Admin Features
- ✅ Dashboard with system overview
- ✅ User Management (view, add, update, delete users)
- ✅ Vendor Management (approve, manage vendor accounts)
- ✅ Membership Management (create and update membership plans)
- ✅ System monitoring and analytics

### 🏪 Vendor Features
- ✅ Vendor Dashboard with business metrics
- ✅ Product Management (add, view, delete products)
- ✅ Transaction History (view customer orders)
- ✅ Product Request Management (respond to customer inquiries)
- ✅ Business analytics and performance overview

### 👤 User Features
- ✅ User Portal with event management tools
- ✅ Browse Vendors (discover service providers)
- ✅ Shopping Cart (add, update, remove items)
- ✅ Guest List Management (create and manage guest lists)
- ✅ Order Status Tracking (track order history)
- ✅ Product Request System (request custom items from vendors)
- ✅ Secure Checkout Process

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Vite** - Next-gen frontend build tool
- **Nodemon** - Auto-restart for development
- **ESLint** - Code linting

## 📁 Project Structure

```
Management-system/
├── backend/                    # Backend API
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── vendorController.js
│   │   └── adminController.js
│   ├── middleware/             # Express middleware
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic services
│   ├── utils/                  # Utility functions
│   ├── API_DOCUMENTATION.md    # API documentation
│   ├── server.js               # Entry point
│   └── package.json
│
├── frontend/                     # Frontend React app
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── BackButton.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/             # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── admin/          # Admin pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── user/           # User pages
│   │   │   └── vendor/         # Vendor pages
│   │   ├── services/            # API service functions
│   │   ├── utils/               # Utility functions
│   │   │   └── productImages.js
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md                    # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git (optional)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Management system"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your MongoDB connection string and other settings

# Start the backend server
npm run dev
```

Backend will start on: http://localhost:5001

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will start on: http://localhost:5175

## 🔑 Environment Variables

### Backend (.env file)

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/event_management
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## 📸 Screenshots

### Landing Page
Modern, responsive landing page with role selection.

### Admin Dashboard
Comprehensive dashboard with system metrics and management tools.

### Vendor Dashboard
Business overview with product management and transaction history.

### User Portal
Event planning tools with shopping cart and guest list management.

## 🔐 Authentication Flow

1. **Registration:** Users can register as Admin, Vendor, or User
2. **Login:** JWT-based authentication with secure password hashing
3. **Role-Based Access:** Different routes and features based on user role
4. **Protected Routes:** Middleware ensures only authorized access

## 🎯 Usage Guide

### Admin Workflow
1. Login as Admin
2. Access Dashboard for system overview
3. Manage Users and Vendors
4. Create and manage Membership plans

### Vendor Workflow
1. Register/Login as Vendor
2. Add products to your catalog
3. View and manage transactions
4. Respond to customer product requests

### User Workflow
1. Register/Login as User
2. Browse vendors and products
3. Add items to cart
4. Manage guest list for events
5. Checkout and track orders
6. Request custom products from vendors

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/vendors` - Get all vendors
- `POST /api/admin/membership` - Create membership plan
- `PUT /api/admin/membership/:id` - Update membership plan

### Vendor
- `GET /api/vendor/dashboard` - Vendor dashboard stats
- `GET /api/vendor/products` - Get vendor products
- `POST /api/vendor/products` - Add new product
- `DELETE /api/vendor/products/:id` - Delete product
- `GET /api/vendor/transactions` - Get transactions
- `GET /api/vendor/requests` - Get product requests
- `POST /api/vendor/requests/:id/respond` - Respond to request

### User
- `GET /api/user/products` - Get all products
- `GET /api/user/vendors` - Get all vendors
- `POST /api/user/cart` - Manage cart items
- `GET /api/user/orders` - Get order history
- `POST /api/user/orders` - Create new order
- `GET /api/user/guest-list` - Get guest list
- `POST /api/user/guest-list` - Manage guest list
- `POST /api/user/requests` - Request custom product

## 🎨 Design Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Modern UI:** Gradient backgrounds, glassmorphism effects, smooth animations
- **Professional Look:** Clean typography, consistent spacing, modern color palette
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation support
- **Performance:** Optimized images, lazy loading, code splitting

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

```bash
cd backend
# Follow platform-specific deployment instructions
# Set environment variables on the platform
```

### Frontend Deployment (e.g., Netlify, Vercel)

```bash
cd frontend
npm run build
# Deploy the dist folder to your hosting platform
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check MONGODB_URI in .env file

2. **CORS Errors**
   - Verify frontend URL is in backend CORS configuration

3. **Image Not Loading**
   - Check browser console for errors
   - Verify ui-avatars.com is accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<p align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong>
</p>

## 👨‍💻 Developer

**Sunny Kumar**

GitHub: https://github.com/sunnymagnaxl
