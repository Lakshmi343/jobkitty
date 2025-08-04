

import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company with this name already exists.",
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });
        await User.findByIdAndUpdate(req.id, {
            'profile.company': company._id
        });
        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Company registration error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; 
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}


export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, companyType, experience } = req.body;
        const companyId = req.params.id;
        const userId = req.id;

 
        if (!name) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const existingCompany = await Company.findById(companyId);
        if (!existingCompany) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        if (existingCompany.userId.toString() !== userId) {
            return res.status(403).json({
                message: "You can only update your own company.",
                success: false
            });
        }

        if (name !== existingCompany.name) {
            const nameExists = await Company.findOne({ name, _id: { $ne: companyId } });
            if (nameExists) {
                return res.status(400).json({
                    message: "Company with this name already exists.",
                    success: false
                });
            }
        }

        const file = req.file;
        let updateData = { 
            name, 
            description, 
            website, 
            location, 
            companyType, 
            experience: experience ? Number(experience) : undefined
        };
        

        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                updateData.logo = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("Logo upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload logo.",
                    success: false
                });
            }
        }
    
        const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Update company error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const getCompanyByUserId = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('profile.company');
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        if (!user.profile.company) {
            return res.status(404).json({
                message: "No company associated with this user.",
                success: false
            });
        }
        return res.status(200).json({
            company: user.profile.company,
            success: true
        });
    } catch (error) {
        console.error("Get company by user ID error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
     }}






export const setupCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const userId = req.id;

        if (!name) {
            return res.status(400).json({ message: "Company name is required.", success: false });
        }

        const user = await User.findById(userId);
        if (user.profile.company) {
            return res.status(400).json({ message: "Company already set up.", success: false });
        }

        const file = req.file;
        let logoUrl = "";
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url;
        }

        const newCompany = await Company.create({
            name,
            description,
            website,
            location,
            logo: logoUrl,
            userId,
        });

        user.profile.company = newCompany._id;
        await user.save();
        
        const populatedUser = await User.findById(userId).populate('profile.company');

        return res.status(201).json({
            message: "Company setup successfully.",
            user: populatedUser,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};