import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String 
    },
    companyType:{
        type:String,
        enum:['Startup', 'MNC', 'SME', 'Government', 'Non-Profit', 'Other']
    },
    experience:{
        type:Number, 
        min:0
    },
    logo:{
        type:String 
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    }
},{timestamps:true})
export const Company = mongoose.model("Company", companySchema);