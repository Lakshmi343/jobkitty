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
    statusUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    statusUpdatedAt: {
        type: Date
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    adminNotes: {
        type: String,
        maxlength: 1000
    }
},{timestamps:true});

export const Application  = mongoose.model("Application", applicationSchema);

