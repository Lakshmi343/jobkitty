import mongoose from 'mongoose';

const jobFairSchema = new mongoose.Schema({
	image: { type: String, default: '' }, // URL or storage path
	title: { type: String, required: true },
	description: { type: String, required: true },
	date: { type: Date, required: true },
	time: { type: String, default: '' }, // optional textual time range
	location: {
		venue: { type: String, default: '' },
		address: { type: String, default: '' },
		city: { type: String, default: '' },
		state: { type: String, default: '' },
		country: { type: String, default: '' }
	},
	organizer: {
		name: { type: String, default: '' },
		email: { type: String, default: '' },
		phone: { type: String, default: '' },
		website: { type: String, default: '' }
	},
	registrationLink: { type: String, default: '' }, // external link if any
	externalLink: { type: String, default: '' },
	status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
	isActive: { type: Boolean, default: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true });

export const JobFair = mongoose.model('JobFair', jobFairSchema);

const jobFairRegistrationSchema = new mongoose.Schema({
	jobFair: { type: mongoose.Schema.Types.ObjectId, ref: 'JobFair', required: true, index: true },
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
	companyName: { type: String, required: true },
	contactName: { type: String, required: true },
	contactEmail: { type: String, required: true },
	contactPhone: { type: String, default: '' },
	website: { type: String, default: '' },
	notes: { type: String, default: '' },
	status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	submittedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

jobFairRegistrationSchema.index({ jobFair: 1, company: 1 }, { unique: false });

export const JobFairRegistration = mongoose.model('JobFairRegistration', jobFairRegistrationSchema);


