# AmEx - Amrita Marketplace

A modern marketplace platform built with Next.js, allowing users to buy and sell items with secure payment processing and real-time communication.

## Features

### User Management
- Secure authentication using Clerk
- User profiles with customizable information
- UPI ID management for payments

### Post Management
- Create and manage listings/requests
- Categorize posts with images
- Set prices and urgency levels
- Track post status (Active, Deleted, Fulfilled)

### Deal Management
- Secure deal creation with OTP verification
- Real-time deal status tracking
- Payment processing with UPI integration
- QR code generation for payments

### Communication
- Real-time chat between users
- Interest notifications
- Email notifications for important updates

### Security
- OTP-based deal verification
- Secure payment processing
- Protected API routes
- User authorization checks

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **State Management**: React Hooks
- **Image Handling**: Next.js Image Optimization
- **UI Components**: Custom components with Tailwind

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes
- **Payment Processing**: UPI Integration
- **Email Service**: Nodemailer

### Development Tools
- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Environment Variables**: .env
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn
- Git

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://neondb_owner:************@************/neondb?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=************
CLERK_SECRET_KEY=************
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/dashboard
CLERK_AFTER_SIGN_UP_URL=/sign-in

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=************
CLOUDINARY_API_KEY=************
CLOUDINARY_API_SECRET=************
CLOUDINARY_CLOUD_NAME=************



PUSHER_APP_ID="************"
PUSHER_KEY="************"
PUSHER_SECRET="************"
NEXT_PUBLIC_PUSHER_KEY="*********"
PUSHER_CLUSTER=**
```

Note: For Gmail SMTP setup:
1. Enable 2-factor authentication in your Google Account
2. Generate an App Password for the application
3. Use the App Password in SMTP_PASSWORD

## Installation

1. Clone the repository:
```bash
git clone git@github.com:rohithvarma444/amEx-Amritapuri.git
cd amEx-Amritapuri
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

4. Start the development server:
```bash
# Start frontend
cd frontend
npm run dev

# Start backend (in a new terminal)
cd backend
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
amEx/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/           # API routes
│   │   │   ├── (protected)/   # Protected routes
│   │   │   └── ...
│   │   ├── components/        # Reusable components
│   │   ├── lib/              # Utility functions
│   │   └── ...
│   ├── public/               # Static assets
│   └── ...
├── backend/
│   ├── prisma/              # Database schema
│   └── ...
└── ...
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Post Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Deal Endpoints
- `POST /api/deals` - Create a new deal
- `GET /api/deals` - Get user's deals
- `POST /api/deals/verify-otp` - Verify deal OTP
- `POST /api/deals/complete-payment` - Complete deal payment

### Chat Endpoints
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id/messages` - Get chat messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@amex.com or create an issue in the repository.