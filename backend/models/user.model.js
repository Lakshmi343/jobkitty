import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },      
    institution: { type: String, required: true },  
    yearOfCompletion: { type: Number, required: true },
    grade: { type: String }, 
});

const experienceSchema = new mongoose.Schema({
    years: { type: Number, default: 0 }, 
    field: { type: String },             
});

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Jobseeker', 'Employer', 'admin'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: { type: String, default: "" },

   
        place: { type: String },  
        education: { type: educationSchema, },
        experience: { type: experienceSchema }, 
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'active'
    },
},{timestamps:true});

export const User = mongoose.model('User', userSchema);
