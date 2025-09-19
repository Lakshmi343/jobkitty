import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  website: { type: String },
  // Legacy single-string location
  location: { type: String },
  // New multi-district support
  state: { type: String },
  districts: [{ type: String }],
  companyType: { 
    type: String,
    enum: [
      'Startup','MNC','SME','Government','Non-Profit','Other','HR','Manufacturing','IT Services','Education',
      'Healthcare','Finance','E-commerce','Consulting','Real Estate','Media & Entertainment','Telecommunications',
      'Energy','Logistics','Agriculture','Automobile','Hospitality','Pharmaceutical','Retail','Construction',
      'Legal','Cybersecurity','AI & Machine Learning','Gaming','Research & Development'
    ]
  },
  experience: { type: Number, min: 0 },
  logo: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
  status: { type: String, enum: ['active','inactive','pending'], default: 'active' },
  createdByAdmin: { type: Boolean, default: false },

  // ✅ Add these fields
  foundedYear: { type: Number },
  numberOfEmployees: { type: Number },
  contactEmail: { type: String },
  contactPhone: { type: String },

}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);
