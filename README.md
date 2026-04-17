# MicroTask Earn - Micro Tasking & Earning Platform

A comprehensive micro-tasking platform where workers earn money by completing small tasks and buyers outsource tasks to a global workforce.

## Live Site URL
[https://microtash.vercel.app/](https://microtash.vercel.app)

## Admin Access (For Testing)
- **Admin Email:** Contact the developer for admin credentials
- **Admin Password:** Contact the developer for admin credentials

> **Note:** For demo purposes, you can register as a buyer/worker or request admin access from the developer.

## GitHub Repositories
- **Client Side:** [https://github.com/meherunnesaenta/Micro-task-platform](https://github.com/meherunnesaenta/Micro-task-platform)
- **Server Side:** [https://github.com/meherunnesaenta/Micro-task-platform-server](https://github.com/meherunnesaenta/Micro-task-platform-server)

## Key Features

- **Three Role System:** Worker, Buyer, and Admin dashboards with role-specific functionalities
- **Secure Authentication:** Email/Password and Google Sign-In with JWT token-based authorization
- **Real-time Notifications:** Instant alerts for task approvals, rejections, withdrawals, and submissions
- **Stripe Payment Integration:** Secure coin purchases with multiple payment tiers (10 coins = $1)
- **Image Upload System:** Integrated ImgBB for profile pictures and task images
- **Task Discovery:** Browse available tasks with real-time required worker counts for workers
- **Task Submission:** Submit work with detailed proof and track submission status
- **Earnings Dashboard:** Track total earnings, pending submissions, and approved tasks for workers
- **Coin Withdrawal:** Convert earned coins to real money (20 coins = $1) with minimum 200 coins ($10) requirement
- **Task Management:** Create, update, and delete tasks with custom requirements for buyers
- **Submission Review:** Review worker submissions with approve/reject functionality for buyers
- **Coin Purchase:** Buy coins via Stripe with multiple package options for buyers
- **User Management:** Manage all users, update roles, and remove accounts for admin
- **Withdrawal Processing:** Review and approve worker withdrawal requests for admin
- **Task Oversight:** Monitor and delete inappropriate tasks for admin
- **Platform Analytics:** View total workers, buyers, coin circulation, and payments
- **Fully Responsive:** Seamless experience across mobile, tablet, and desktop devices
- **Interactive Animations:** Engaging homepage with animated elements and carousel sliders
- **Private Route Protection:** Persistent sessions without login page redirects on reload
- **Pagination:** Efficient data loading on submission pages

## Technologies Used

### Frontend
- React.js 18
- React Router DOM v6
- Tailwind CSS / Custom CSS
- Swiper.js for carousels
- React Hook Form
- Axios for API calls
- Firebase Authentication
- Stripe.js for payments

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe SDK

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase project
- Stripe account (for payments)
- vercel

### Installation

**1. Clone the repository**

git clone https://github.com/meherunnesaenta/Micro-task-platform.git
cd microtask-earn-client

**2. Install dependencies**
npm install

**3. Create environment variables**
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_IMGBB_API_KEY=your_imgbb_api_key

**4. Start development server**
npm start


## Deployment
## Frontend (Vercel Hosting)
npm run build
vercel deploy

## Backend (Render/Heroku)
Ensure MongoDB connection string is properly configured in environment variables.

## License
This project is for assessment purposes only. All rights reserved.

## Support
For support, please create an issue in the GitHub repository.