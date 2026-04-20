# 🚀 Micro Task and Earning Platform - TaskEarn

A full-stack micro-task platform where users can earn money by completing small tasks or post tasks to get work done by verified workers.

## 🌐 Live Site URL
[https://microtash.vercel.app](https://microtash.vercel.app)

## 👑 Admin Credentials
- **Email:** `admin.microtask@gmail.com`
- **Password:** `*******`

## ✨ Key Features

### For Workers:
- ✅ Browse and filter available tasks by category
- ✅ Submit task completions with detailed proof
- ✅ Track submission status (pending/approved/rejected)
- ✅ View earnings in coins (20 coins = $1)
- ✅ Request withdrawal with minimum 200 coins ($10)
- ✅ View withdrawal history and status
- ✅ Complete profile management
- ✅ Real-time notifications for approvals/rejections

### For Buyers:
- ✅ Create tasks with detailed instructions
- ✅ Set required workers and payable amount
- ✅ Upload task images (ImgBB integration)
- ✅ Review worker submissions
- ✅ Approve/Reject submissions with coin rewards
- ✅ Purchase coins via Stripe payment
- ✅ View payment history and task statistics
- ✅ Edit/Delete posted tasks

### For Admin:
- ✅ Complete platform overview dashboard
- ✅ Manage all users (update roles, delete users)
- ✅ Manage all tasks across platform
- ✅ Process withdrawal requests (approve/reject)
- ✅ View platform analytics and reports
- ✅ Monitor platform growth and revenue

### General Features:
- 🎨 Modern responsive design with Dark/Light theme
- 🔐 Secure JWT authentication
- 📱 Mobile-friendly responsive layout
- 🔔 Real-time notification system
- 📊 Interactive dashboard with statistics
- 💳 Stripe payment integration
- 🖼️ Image upload with ImgBB
- 📄 Pagination on all lists
- 🎭 Role-based access control (Worker/Buyer/Admin)

```


## 🏗️ Project Structure

```
client/
├── index.html                   # Main HTML entry
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite config
├── tailwind.config.js           # Tailwind config
├── .env                         # Environment variables
├── public/                      # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Global styles
│   ├── App.css                  # App styles
│   ├── context/                 # React Context
│   │   └── AuthContext.jsx
│   ├── hooks/                   # Custom hooks
│   │   └── useRefreshUser.js
│   ├── utils/                   # Utilities
│   │   ├── api.js
│   │   └── endpoints.js
├── components/              # Reusable components
│   │   ├── shared/              # Navbar, Footer, Logo, NotificationBell, ProtectedRoute
│   │   ├── dashboard/           # DashboardLayout
│   │   └── Home/                # HeroSlider, Banner, Features, TopWorker, PostedTasks
│   └── assets/                  # Images (hero.png, react.svg, vite.svg)
│       └── hero.png
│   └── pages/                   # Page components
│       ├── Home.jsx
│       ├── NotFound.jsx
│       ├── auth/
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── dashboard/
│           ├── admin/
│           │   ├── AdminHome.jsx
│           │   ├── AdminProfile.jsx
│           │   ├── ManageTasks.jsx
│           │   ├── ManageUsers.jsx
│           │   ├── ManageWithdrawals.jsx
│           │   └── Reports.jsx
│           ├── buyer/
│           │   ├── BuyerHome.jsx
│           │   ├── BuyerAddTask.jsx
│           │   ├── BuyerMyTasks.jsx
│           │   ├── BuyerReviewSubmissions.jsx
│           │   ├── BuyerPurchaseCoin.jsx
│           │   ├── BuyerPaymentHistory.jsx
│           │   ├── BuyerProfile.jsx
│           │   └── BuyerTaskDetails.jsx
│           └── worker/
│               ├── WorkerHome.jsx
│               ├── WorkerTaskList.jsx
│               ├── WorkerTaskDetails.jsx
│               ├── WorkerSubmissions.jsx
│               ├── WorkerSubmissionDetails.jsx
│               ├── WorkerWithdrawals.jsx
│               └── WorkerProfile.jsx
└── styles/                      # CSS files
    └── home.css
```


### Frontend:
- React 18 with Vite
- Tailwind CSS + DaisyUI
- React Router DOM v6
- React Hook Form
- Axios
- Lucide React Icons
- Swiper.js (Carousel)
- React Toastify
- Stripe.js

### Backend:
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Stripe API
- ImgBB API

### Deployment:
- Frontend: Vercel
- Backend: Render / Cyclic
- Database: MongoDB Atlas

## 📦 Installation Guide

### Prerequisites:
- Node.js (v18+)
- npm/yarn

### Quick Start:
```bash
git clone https://github.com/meherunnesaenta/Micro-task-platform.git
cd client

npm install

cp .env.example .env
```

### .env Configuration (Demo):
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_IMGBB_API_KEY=abc123...
```
**Note:** Replace with your actual keys

### Run Development Server:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
npm run preview
```

**Backend API**: https://github.com/meherunnesaenta/Micro-task-platform-server


## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/submissions/:id/approve` | Approve submission |

## 🔑 Test Credentials

**Worker:**
- `ali.reza.work@gmail.com` / `Worker@123`

**Buyer:**
- `techstart.buyer@gmail.com` / `Buyer@123`

**Admin:**
- `admin.microtask@gmail.com` / `*****`

## 📂 Repository Links
- Frontend: https://github.com/meherunnesaenta/Micro-task-platform
- Backend: https://github.com/meherunnesaenta/Micro-task-platform-server

## 📄 License
MIT License

