// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     requirements: [{
//         type: String
//     }],
//     salary: {
//         type: Number,
//         required: true
//     },
//     experienceLevel:{
//         type:Number,
//         required:true,
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     jobType: {
//         type: String,
//         required: true
//     },
//     position: {
//         type: Number,
//         required: true
//     },
//     company: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Company',
//         required: true
//     },
//     created_by: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     applications: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Application',
//         }
//     ]
// },{timestamps:true});
// export const Job = mongoose.model("Job", jobSchema);\\




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
    requirements: [{
         type: String 
        }],
    salary: { 
        type: Number,
         required: true
         },
    experienceLevel: {
         type: Number,
          required: true 
        },
    location: {
        type: String,
        enum: [
            "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
            "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
            "Kozhikode", "Wayanad", "Kannur", "Kasaragod"  
        ],
        required: true
    },

    jobType: {
         type: String,
          required: true 
        },
    position: {
         type: Number, 
         required: true 
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
        }]
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
