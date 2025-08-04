# Job Portal with Admin Dashboard

A comprehensive job portal application with a powerful admin dashboard for managing users, jobs, companies, and more.

## Features

### Admin Dashboard
- **Authentication & Authorization**: Separate admin login with role-based access control
- **Dashboard Overview**: Statistics, charts, and quick actions
- **User Management**: View, activate/deactivate, and delete users
- **Job Management**: Approve, reject, and manage job postings
- **Company Management**: Manage registered companies
- **Category Management**: Create, update, and delete job categories
- **Analytics**: Detailed reports and statistics
- **Role-based Access Control**: Superadmin, moderator, and support roles

### User Features
- Job posting and application
- User registration and authentication
- Company profiles
- Job search and filtering
- Application tracking

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file**:
   ```bash
   cp .env.example .env
   ```
   
   Add the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   PORT=8000
   ```

4. **Create superadmin user**:
   ```bash
   npm run create-admin
   ```
   
   This creates a superadmin with:
   - Email: admin@jobportal.com
   - Password: admin123
   - Role: superadmin

5. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Admin Access

### Login Credentials
- **URL**: http://localhost:5173/admin/login
- **Email**: admin@jobportal.com
- **Password**: admin123
- **Role**: superadmin

### Admin Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main admin dashboard
- `/admin/users` - User management (superadmin only)
- `/admin/jobs` - Job management
- `/admin/companies` - Company management
- `/admin/categories` - Category management
- `/admin/analytics` - Analytics and reports

## Admin Features

### Dashboard
- Overview statistics (users, companies, jobs, applications)
- Recent jobs and applications
- Quick action buttons
- Job status overview (pending, approved, rejected)

### User Management
- View all registered users
- Search and filter users
- Activate/deactivate users
- Delete users (superadmin only)
- Role-based access control

### Job Management
- View all job postings
- Approve/reject pending jobs
- Search and filter jobs by status
- Delete jobs (superadmin only)
- View job details

### Company Management
- View all registered companies
- Update company status
- Manage company profiles

### Category Management
- Create new job categories
- Update existing categories
- Delete categories (superadmin only)

### Analytics
- Monthly job posting statistics
- User registration trends
- Job status distribution
- Application analytics

## Role-based Access Control

### Superadmin
- Full access to all features
- Can delete users, jobs, and categories
- Can manage all admin functions

### Moderator
- Can approve/reject jobs
- Can manage companies and categories
- Cannot delete users or sensitive data

### Support
- Read-only access to most features
- Can view statistics and reports
- Limited management capabilities

## API Endpoints

### Admin Authentication
- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/admin/register` - Create admin (protected)

### Dashboard
- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/analytics` - Analytics data

### User Management
- `GET /api/v1/admin/users` - Get all users (superadmin)
- `PATCH /api/v1/admin/users/:id/status` - Update user status (superadmin)
- `DELETE /api/v1/admin/users/:id` - Delete user (superadmin)

### Job Management
- `GET /api/v1/admin/jobs` - Get all jobs
- `PATCH /api/v1/admin/jobs/:id/approve` - Approve job
- `PATCH /api/v1/admin/jobs/:id/reject` - Reject job
- `DELETE /api/v1/admin/jobs/:id` - Delete job (superadmin)

### Company Management
- `GET /api/v1/admin/companies` - Get all companies
- `PATCH /api/v1/admin/companies/:id/status` - Update company status

### Category Management
- `GET /api/v1/admin/categories` - Get all categories
- `POST /api/v1/admin/categories` - Create category
- `PUT /api/v1/admin/categories/:id` - Update category
- `DELETE /api/v1/admin/categories/:id` - Delete category (superadmin)

## Security Features

- JWT-based authentication
- Role-based access control
- Protected admin routes
- Password hashing with bcrypt
- Input validation and sanitization

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React.js
- React Router
- Axios for API calls
- Tailwind CSS
- Lucide React for icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 