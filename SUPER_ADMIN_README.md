# Super Admin Functionality

## Overview
The Super Admin role has been implemented with comprehensive platform management capabilities including job moderation, user monitoring, report handling, and compliance enforcement.

## Responsibilities Implemented

### 1. Job Post Moderation
- **Approve/Reject Jobs**: Super admins can approve or reject job posts with detailed reasoning
- **Violation Detection**: Jobs can be flagged for various violations (spam, fake, inappropriate, scam, duplicate)
- **Quality Control**: Implemented job quality scoring system (1-10 scale)
- **Content Review**: Check job descriptions for clarity, completeness, and compliance

**Features:**
- Enhanced job rejection with violation type classification
- Quality check system with scoring and recommendations
- Activity logging for all moderation actions
- Bulk job management capabilities

### 2. Employer Profile Review
- **Company Verification**: Review and verify employer company details
- **Document Validation**: Check company documents and credentials
- **Status Management**: Approve, suspend, or reject company accounts
- **Compliance Monitoring**: Ensure companies follow platform guidelines

**Features:**
- Company status management (active, suspended, rejected)
- Document verification workflow
- Compliance action tracking
- Employer activity monitoring

### 3. Report Handling
- **Report Management**: Handle user reports for spam, abuse, violations
- **Investigation System**: Assign reports to admins for investigation
- **Resolution Tracking**: Track report resolution with detailed actions
- **Priority Management**: Categorize reports by priority (critical, high, medium, low)

**Features:**
- Report assignment and investigation workflow
- Evidence collection and review
- Resolution tracking with action details
- Report status management (pending, investigating, resolved, dismissed)

### 4. Content Quality Check
- **Job Description Review**: Ensure job descriptions meet platform standards
- **Duplicate Detection**: Identify and flag duplicate job postings
- **Quality Scoring**: Rate job quality on a 1-10 scale
- **Recommendations**: Provide improvement suggestions for job postings

**Features:**
- Quality check system with scoring
- Issue identification and tracking
- Improvement recommendations
- Quality metrics dashboard

### 5. User Behavior Monitoring
- **User Activity Tracking**: Monitor user behavior and activity patterns
- **Warning System**: Issue warnings to users for policy violations
- **Suspension Management**: Suspend users temporarily or permanently
- **Behavior Analysis**: Track user applications, job postings, and reports

**Features:**
- User activity dashboard
- Warning and suspension system
- Behavior pattern analysis
- User compliance tracking

### 6. Category Management
- **Category Creation**: Create and manage job categories
- **Category Updates**: Modify existing categories
- **Category Deletion**: Remove obsolete categories
- **Category Assignment**: Ensure proper job categorization

**Features:**
- Full CRUD operations for categories
- Category usage analytics
- Category assignment validation
- Category cleanup tools

### 7. Compliance Enforcement
- **Terms of Service**: Enforce platform terms and conditions
- **Community Standards**: Maintain community guidelines
- **Legal Compliance**: Ensure legal requirements are met
- **Action Tracking**: Log all compliance actions

**Features:**
- Compliance action system
- Legal requirement tracking
- Community standards enforcement
- Compliance reporting

## Technical Implementation

### Backend Models

#### Admin Model (`admin.model.js`)
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['superadmin', 'moderator', 'support'],
  permissions: {
    jobModeration: Boolean,
    employerReview: Boolean,
    reportHandling: Boolean,
    contentQuality: Boolean,
    userMonitoring: Boolean,
    categoryManagement: Boolean,
    complianceEnforcement: Boolean
  },
  isActive: Boolean,
  lastLogin: Date,
  activityLog: [{
    action: String,
    target: String,
    targetId: ObjectId,
    details: String,
    timestamp: Date
  }]
}
```

#### Report Model (`report.model.js`)
```javascript
{
  reporter: ObjectId (ref: User),
  reportedItem: {
    type: ['job', 'company', 'user', 'application'],
    itemId: ObjectId
  },
  reportType: ['spam', 'fake', 'inappropriate', 'scam', 'duplicate', 'violation', 'other'],
  description: String,
  evidence: [{
    type: String,
    description: String
  }],
  status: ['pending', 'investigating', 'resolved', 'dismissed'],
  priority: ['low', 'medium', 'high', 'critical'],
  assignedTo: ObjectId (ref: Admin),
  resolution: {
    action: String,
    details: String,
    resolvedBy: ObjectId (ref: Admin),
    resolvedAt: Date
  }
}
```

### Enhanced User Model
```javascript
{
  // ... existing fields
  status: ['active', 'inactive', 'pending', 'suspended'],
  warnings: [{
    message: String,
    reason: String,
    issuedBy: ObjectId (ref: Admin),
    issuedAt: Date
  }],
  suspension: {
    reason: String,
    suspendedBy: ObjectId (ref: Admin),
    suspendedAt: Date,
    suspensionEnd: Date
  },
  complianceAction: {
    action: String,
    reason: String,
    type: String,
    enforcedBy: ObjectId (ref: Admin),
    enforcedAt: Date
  }
}
```

### Enhanced Job Model
```javascript
{
  // ... existing fields
  status: ['pending', 'approved', 'rejected', 'removed'],
  violationType: ['spam', 'fake', 'inappropriate', 'scam', 'duplicate', 'violation', 'other'],
  qualityCheck: {
    score: Number (1-10),
    issues: [String],
    recommendations: [String],
    checkedBy: ObjectId (ref: Admin),
    checkedAt: Date
  },
  complianceAction: {
    action: String,
    reason: String,
    type: String,
    enforcedBy: ObjectId (ref: Admin),
    enforcedAt: Date
  }
}
```

## API Endpoints

### Authentication
- `POST /admin/login` - Admin login
- `POST /admin/register` - Create new admin

### Dashboard & Analytics
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/analytics` - Platform analytics

### User Management
- `GET /admin/users` - Get all users (superadmin only)
- `PATCH /admin/users/:userId/status` - Update user status
- `DELETE /admin/users/:userId` - Delete user
- `GET /admin/users/:userId/activity` - Get user activity
- `POST /admin/users/:userId/warn` - Warn user
- `POST /admin/users/:userId/suspend` - Suspend user

### Job Management
- `GET /admin/jobs` - Get all jobs
- `PATCH /admin/jobs/:jobId/approve` - Approve job
- `PATCH /admin/jobs/:jobId/reject` - Reject job
- `DELETE /admin/jobs/:jobId` - Delete job
- `POST /admin/jobs/:jobId/quality-check` - Quality check job

### Report Handling
- `GET /admin/reports` - Get all reports
- `GET /admin/reports/:reportId` - Get specific report
- `PATCH /admin/reports/:reportId/assign` - Assign report
- `PATCH /admin/reports/:reportId/resolve` - Resolve report

### Compliance
- `POST /admin/compliance/:targetType/:targetId` - Enforce compliance

### Activity Log
- `GET /admin/activity/:adminId` - Get admin activity log

## Frontend Components

### SuperAdminDashboard
- Overview of platform statistics
- Pending reports and jobs
- Quick action buttons
- Compliance overview

### ReportsManagement
- Report listing with filters
- Report details and resolution
- Assignment and investigation workflow
- Evidence review

### AdminLayout
- Role-based navigation
- Super admin specific menu items
- Activity indicators

## Setup Instructions

### 1. Create Super Admin User
```bash
cd backend
node scripts/createSuperAdmin.js
```

This creates a super admin with:
- Email: superadmin@jobportal.com
- Password: superadmin123
- Role: superadmin
- All permissions enabled

### 2. Database Setup
Ensure MongoDB is running and the database is properly configured.

### 3. Environment Variables
Make sure these environment variables are set:
```env
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```

## Usage Examples

### Job Moderation
1. Login as super admin
2. Navigate to Jobs section
3. Review pending jobs
4. Approve/reject with detailed reasoning
5. Apply quality checks

### Report Handling
1. Check Reports section for pending reports
2. Assign reports to investigate
3. Review evidence and details
4. Resolve with appropriate action

### User Monitoring
1. Access User Monitoring section
2. Review user activity
3. Issue warnings or suspensions
4. Track compliance actions

### Compliance Enforcement
1. Identify violations
2. Apply appropriate actions
3. Document compliance actions
4. Monitor platform health

## Security Features

- Role-based access control
- Activity logging for all actions
- Permission-based functionality
- Secure authentication
- Input validation and sanitization

## Monitoring and Analytics

- Admin activity tracking
- Platform usage statistics
- Compliance metrics
- Quality control reports
- User behavior analytics

This implementation provides a comprehensive super admin system that covers all the required responsibilities while maintaining security, scalability, and ease of use. 