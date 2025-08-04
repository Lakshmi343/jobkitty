import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['Jobseeker','Employer','admin'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, 
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'active'
    },
    warnings: [{
        message: { type: String, required: true },
        reason: { type: String, required: true },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        issuedAt: { type: Date, default: Date.now }
    }],
    suspension: {
        reason: { type: String },
        suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        suspendedAt: { type: Date },
        suspensionEnd: { type: Date }
    },
    complianceAction: {
        action: { type: String },
        reason: { type: String },
        type: { type: String },
        enforcedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        enforcedAt: { type: Date }
    }
},{timestamps:true});

export const User = mongoose.model('User', userSchema);