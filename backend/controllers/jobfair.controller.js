import { JobFair, JobFairRegistration } from '../models/jobfair.model.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';

export const createJobFair = async (req, res) => {
	try {
		const payload = { ...req.body, createdBy: req.admin._id };

		// Normalize nested fields when coming from multipart form-data
		if (payload['location[city]'] || payload['location[state]'] || payload['location[country]']) {
			payload.location = {
				city: payload['location[city]'] || '',
				state: payload['location[state]'] || '',
				country: payload['location[country]'] || ''
			};
			delete payload['location[city]'];
			delete payload['location[state]'];
			delete payload['location[country]'];
		}

		// Normalize date if sent as string
		if (payload.date && typeof payload.date === 'string') {
			const d = new Date(payload.date);
			if (!isNaN(d.getTime())) payload.date = d;
		}

		// Handle optional poster upload
		if (req.file) {
			try {
				const fileUri = getDataUri(req.file);
				const uploadRes = await cloudinary.uploader.upload(fileUri.content);
				payload.image = uploadRes.secure_url;
			} catch (e) {
				return res.status(500).json({ success: false, message: 'Failed to upload poster' });
			}
		}

		const jobFair = await JobFair.create(payload);
		return res.status(201).json({ success: true, data: jobFair });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const updateJobFair = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = { ...req.body };

		// Normalize nested fields when coming from multipart form-data
		if (updates['location[city]'] || updates['location[state]'] || updates['location[country]']) {
			updates.location = {
				city: updates['location[city]'] || '',
				state: updates['location[state]'] || '',
				country: updates['location[country]'] || ''
			};
			delete updates['location[city]'];
			delete updates['location[state]'];
			delete updates['location[country]'];
		}

		if (updates.date && typeof updates.date === 'string') {
			const d = new Date(updates.date);
			if (!isNaN(d.getTime())) updates.date = d;
		}

		// Optional poster replacement
		if (req.file) {
			try {
				const fileUri = getDataUri(req.file);
				const uploadRes = await cloudinary.uploader.upload(fileUri.content);
				updates.image = uploadRes.secure_url;
			} catch (e) {
				return res.status(500).json({ success: false, message: 'Failed to upload poster' });
			}
		}

		const updated = await JobFair.findByIdAndUpdate(id, updates, { new: true });
		if (!updated) {
			return res.status(404).json({ success: false, message: 'Job fair not found' });
		}
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const deleteJobFair = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await JobFair.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({ success: false, message: 'Job fair not found' });
		}
		await JobFairRegistration.deleteMany({ jobFair: id });
		return res.status(200).json({ success: true, message: 'Deleted successfully' });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const getJobFairsPublic = async (req, res) => {
	try {
		const { status, activeOnly } = req.query;
		const filter = {};
		if (status) filter.status = status;
		if (activeOnly === 'true') filter.isActive = true;
		const list = await JobFair.find(filter).sort({ date: 1, createdAt: -1 });
		return res.status(200).json({ success: true, data: list });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const getJobFairByIdPublic = async (req, res) => {
	try {
		const { id } = req.params;
		const item = await JobFair.findById(id);
		if (!item) {
			return res.status(404).json({ success: false, message: 'Job fair not found' });
		}
		return res.status(200).json({ success: true, data: item });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const listJobFairsAdmin = async (req, res) => {
	try {
		const list = await JobFair.find({}).sort({ createdAt: -1 });
		return res.status(200).json({ success: true, data: list });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const registerCompanyForJobFair = async (req, res) => {
	try {
		const { id } = req.params;
		const jobFair = await JobFair.findById(id);
		if (!jobFair) {
			return res.status(404).json({ success: false, message: 'Job fair not found' });
		}
		const { company, companyName, contactName, contactEmail, contactPhone, website, notes } = req.body;
		const registration = await JobFairRegistration.create({
			jobFair: id,
			company: company || req.user?.profile?.company || undefined,
			companyName,
			contactName,
			contactEmail,
			contactPhone,
			website,
			notes,
			submittedByUser: req.id || undefined
		});
		return res.status(201).json({ success: true, data: registration });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const listRegistrationsForJobFair = async (req, res) => {
	try {
		const { id } = req.params;
		const regs = await JobFairRegistration.find({ jobFair: id }).populate('company').sort({ createdAt: -1 });
		return res.status(200).json({ success: true, data: regs });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const updateRegistrationStatus = async (req, res) => {
	try {
		const { regId } = req.params;
		const { status } = req.body;
		const updated = await JobFairRegistration.findByIdAndUpdate(regId, { status }, { new: true });
		if (!updated) {
			return res.status(404).json({ success: false, message: 'Registration not found' });
		}
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};


