# BuyKart - E-Commerce Platform 🛒

BuyKart is a modern, high-performance full-stack e-commerce web application built with React 19, Vite, Tailwind CSS v4, and Node.js with MongoDB Atlas persistence.

---

## ✨ Features

- 📱 **Responsive Design**: Clean and modern UI optimized for desktop, tablet, and mobile devices.
- 🛍️ **Product Catalog & Filters**: Explore products with dynamic category filters, search, badge tags, and pagination.
- 🔍 **Real-Time Search**: Instant search matching product titles, descriptions, and brands.
- 🛒 **Cart & Wishlist Management**: Seamless cart updates, quantity controls, and one-click "Save for Later" wishlist functionality.
- 💳 **Checkout Flow**: Multi-step checkout with address selection, payment option previews, and order summaries.
- 📦 **Order Management**: View past orders, tracking statuses, and detailed purchase histories.
- 🔐 **User Authentication**: Account registration, login, and user profile management.
- ⚡ **Full-Stack Integration**: Node.js backend API with MongoDB Atlas storage and automatic Vite dev proxy.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, Lucide Icons
- **Backend**: Node.js HTTP server, MongoDB Driver
- **Database**: MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB Atlas cluster or local MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aditya1708-tech/BuyKart.git
   cd BuyKart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB credentials:
   ```bash
   cp .env.example .env
   ```

   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=buykart
   API_PORT=5000
   ```

---

## 💻 Running Locally

### Start Frontend Dev Server
Runs on Vite default port `http://localhost:5173`:
```bash
npm run dev
```

### Start Backend API Server
Runs on `http://localhost:5000`:
```bash
npm run server
```

The Vite dev server is pre-configured to proxy `/api/*` requests to the backend server.

### Build for Production
```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
