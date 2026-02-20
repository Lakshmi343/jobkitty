import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    statusReason: {
        type: String,
        maxlength: 500
    },
    rejectionReason: {
        type: String,
        maxlength: 500
    },
    statusUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    statusUpdatedAt: {
        type: Date
    },
    adminActionAt: {
        type: Date
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    adminNotes: {
        type: String,
        maxlength: 1000
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    }
},{timestamps:true});

export const Application  = mongoose.model("Application", applicationSchema);

