# Application Approval API Testing Guide

## New API Endpoints Created

### 1. Single Application Approval/Rejection
```bash
# Approve a single application
PUT /api/v1/application/admin/applications/:id/approve
Headers: Authorization: Bearer <admin_token>

# Reject a single application
PUT /api/v1/application/admin/applications/:id/reject
Headers: Authorization: Bearer <admin_token>
Body: { "reason": "Not qualified" }
```

### 2. Bulk Application Approval/Rejection
```bash
# Bulk approve multiple applications
PUT /api/v1/application/admin/applications/bulk-approve
Headers: Authorization: Bearer <admin_token>
Body: { 
  "applicationIds": ["app1", "app2", "app3"],
  "notes": "Approved after review"
}

# Bulk reject multiple applications
PUT /api/v1/application/admin/applications/bulk-reject
Headers: Authorization: Bearer <admin_token>
Body: { 
  "applicationIds": ["app1", "app2", "app3"],
  "rejectionReason": "Insufficient experience",
  "notes": "Rejected after screening"
}
```

### 3. Approval Statistics
```bash
# Get approval statistics
GET /api/v1/application/admin/applications/stats?timeframe=30d
Headers: Authorization: Bearer <admin_token>

# Timeframe options: 7d, 30d, 90d, 1y
```

### 4. Pending Applications
```bash
# Get pending applications for review
GET /api/v1/application/admin/applications/pending?page=1&limit=20&sortBy=createdAt&sortOrder=desc
Headers: Authorization: Bearer <admin_token>
```

## Enhanced Application Model Fields

### New Fields Added:
- `rejectionReason`: String (max 500) - Specific reason for rejection
- `adminActionAt`: Date - Timestamp of admin action
- `priority`: String (low/medium/high) - Application priority level
- `reviewedBy`: ObjectId (User) - Admin who reviewed the application
- `reviewedAt`: Date - When the application was reviewed

### Updated Fields:
- `statusUpdatedBy`: Now references 'User' instead of 'Admin'

## Testing Examples

### Test with curl:

```bash
# Test bulk approval
curl -X PUT http://localhost:8000/api/v1/application/admin/applications/bulk-approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "applicationIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "notes": "Approved after technical review"
  }'

# Test statistics
curl -X GET "http://localhost:8000/api/v1/application/admin/applications/stats?timeframe=7d" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Test pending applications
curl -X GET "http://localhost:8000/api/v1/application/admin/applications/pending?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Response Formats

### Bulk Operations Response:
```json
{
  "success": true,
  "message": "2 applications approved successfully",
  "data": {
    "approved": 2,
    "applications": [
      {
        "id": "507f1f77bcf86cd799439011",
        "status": "accepted",
        "jobTitle": "Software Engineer",
        "applicantName": "John Doe"
      }
    ]
  }
}
```

### Statistics Response:
```json
{
  "success": true,
  "data": {
    "recent": {
      "pending": 15,
      "accepted": 25,
      "rejected": 8,
      "total": 48,
      "timeframe": "30d"
    },
    "total": {
      "pending": 45,
      "accepted": 120,
      "rejected": 35,
      "total": 200
    }
  }
}
```

## Features Implemented

1. **Bulk Operations**: Approve/reject multiple applications at once
2. **Email Notifications**: Automatic emails sent to applicants
3. **Statistics Dashboard**: Track approval metrics over time
4. **Enhanced Tracking**: Better audit trail with admin actions
5. **Priority System**: Mark applications with priority levels
6. **Error Handling**: Comprehensive error responses
7. **Pagination**: Efficient data loading for large datasets

## Security Notes

- All endpoints require admin authentication
- Only pending applications can be bulk approved/rejected
- Email sending failures don't break the approval process
- All actions are logged with timestamps and admin user ID
