import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'moderator', 'support'], 
    required: true 
  },
  permissions: {
    jobModeration: { type: Boolean, default: false },
    employerReview: { type: Boolean, default: false },
    reportHandling: { type: Boolean, default: false },
    contentQuality: { type: Boolean, default: false },
    userMonitoring: { type: Boolean, default: false },
    categoryManagement: { type: Boolean, default: false },
    complianceEnforcement: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  activityLog: [{
    action: { type: String, required: true },
    target: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });


adminSchema.pre('save', function(next) {
  if (this.role === 'superadmin') {
    this.permissions = {
      jobModeration: true,
      employerReview: true,
      reportHandling: true,
      contentQuality: true,
      userMonitoring: true,
      categoryManagement: true,
      complianceEnforcement: true
    };
  } else if (this.role === 'moderator') {
    this.permissions = {
      jobModeration: true,
      employerReview: true,
      reportHandling: true,
      contentQuality: true,
      userMonitoring: false,
      categoryManagement: false,
      complianceEnforcement: false
    };
  } else if (this.role === 'support') {
    this.permissions = {
      jobModeration: false,
      employerReview: false,
      reportHandling: true,
      contentQuality: false,
      userMonitoring: false,
      categoryManagement: false,
      complianceEnforcement: false
    };
  }
  next();
});

export const Admin = mongoose.model('Admin', adminSchema);