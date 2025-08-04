import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedItem: {
    type: { type: String, enum: ['job', 'company', 'user', 'application'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  reportType: {
    type: String,
    enum: ['spam', 'fake', 'inappropriate', 'scam', 'duplicate', 'violation', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  evidence: [{
    type: String, // URLs to evidence files
    description: String
  }],
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  resolution: {
    action: { type: String },
    details: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    resolvedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema); 