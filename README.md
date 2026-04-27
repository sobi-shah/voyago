# Voyago Travel - Booking System

A startup-level, professional full-stack web application for a travel agency booking system. Originally built with vanilla HTML/CSS/JS, it has been upgraded to a modern, production-ready architecture.

## 🚀 Features

- **Premium UI/UX:** Built with Tailwind CSS, featuring a responsive, mobile-first design, custom color palette (Dark Blue, Light Blue, Orange), and glassmorphism elements.
- **Animations:** Smooth scroll reveals and page transitions using AOS (Animate on Scroll) and CSS transitions.
- **Full-Stack Architecture:** Node.js + Express backend with a MongoDB database.
- **Authentication:** Secure JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC):** 
  - **Guests:** Can browse packages and destinations.
  - **Users:** Can securely register, login, and book travel packages.
  - **Admins:** Have access to a protected Admin Dashboard to view overall stats and manage (delete) bookings.
- **Mock Payment Gateway:** UI integration for processing payments during the booking flow.
- **Dynamic Content:** Packages and Bookings are served via REST APIs from the MongoDB database.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, AOS Animations
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Environment Management:** dotenv

## 📁 Directory Structure

```
Traveling project/
├── backend/
│   ├── config/          # DB config
│   ├── middleware/      # Auth & Admin middleware
│   ├── models/          # Mongoose Schemas (User, Package, Booking)
│   ├── routes/          # API endpoint routes
│   ├── server.js        # Express application entry point
│   └── package.json     # Node dependencies
├── frontend/
│   ├── css/             # Custom CSS overrides
│   ├── js/              # Frontend logic (app.js, auth.js, admin.js)
│   ├── images/          # Assets
│   └── *.html           # Views (index, packages, booking, admin, login, register)
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or an Atlas URI)

### 1. Backend Setup
1. Open a terminal and navigate to the project root directory:
   ```bash
   cd "c:\Users\win 11\Desktop\Traveling project"
   ```
2. Install dependencies in the backend folder:
   ```bash
   cd backend
   npm install
   cd ..
   ```
3. Create a `.env` file in the project root by copying `.env.example`:
   ```bash
   copy .env.example .env
   ```
4. Update `.env` with your Atlas connection string:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   ```
5. Start the development server from the project root:
   ```bash
   node backend/server.js
   ```
   The backend will run on `http://localhost:5000` and serve the frontend files from the project root.

### 2. Frontend Access
Since the Express server is configured to serve the `frontend/` directory statically, you can access the full application by simply opening:
`http://localhost:5000` in your web browser.

## 📖 API Documentation

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Authenticate user & get JWT token

### Package Routes (`/api/packages`)
- `GET /`: Get all travel packages (Public)
- `POST /`: Create a new package (Admin)
- `DELETE /:id`: Delete a package (Admin)

### Booking Routes (`/api/bookings`)
- `POST /`: Submit a new booking (Protected)
- `GET /`: Get all bookings (Admin)
- `GET /mybookings`: Get bookings for the logged-in user (Protected)
- `DELETE /:id`: Delete a booking (Admin/Owner)

## 🔮 Future Enhancements
- Real payment gateway integration (Stripe/PayPal)
- Google Maps API integration for dynamic package locations
- Real-time weather API integration for destinations
- User profile page to view booking history and manage wishlists

## 🎓 University Project Details
This project fulfills the requirements for a professional final year/mid-term university submission, demonstrating competency in frontend UI/UX design, REST API development, database management, and authentication strategies.
