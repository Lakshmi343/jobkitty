
import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true 
    },
    description: { 
        type: String,
         required: true
         },
    requirements: {
        type: [String],
        default: ["No specific requirements"]
    },
    salary: {
        min: { type: Number, required: true, default: 0 },
        max: { type: Number, required: true, default: 0 }
    },
    experienceLevel: {
         type: String,
         required: false,
         default: "Entry Level"
        },
    experience: {
        min: { type: Number, required: true, default: 0 },
        max: { type: Number, required: true, default: 5 }
    },
    openings: {
        type: Number,
        required: true,
        default: 1
    },
    location: {
        type: String,
        required: true,
        default: "Remote"
    },

    jobType: {
         type: String,
         required: true,
         default: "Full-time"
        },
    position: {
         type: Number, 
         required: true,
         default: 1
        },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Category', required: true
         },
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true },
    applications: [{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Application' 
        }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'removed'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    },
    violationType: {
        type: String,
        enum: ['spam', 'fake', 'inappropriate', 'scam', 'duplicate', 'violation', 'other']
    },
    qualityCheck: {
        score: { type: Number, min: 0, max: 10 },
        issues: [{ type: String }],
        recommendations: [{ type: String }],
        checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        checkedAt: { type: Date }
    },
    complianceAction: {
        action: { type: String },
        reason: { type: String },
        type: { type: String },
        enforcedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        enforcedAt: { type: Date }
    }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
