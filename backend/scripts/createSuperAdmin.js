import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/admin.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email: 'superadmin@jobportal.com' });
    if (existingAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superAdmin = new Admin({
      name: 'Super Administrator',
      email: 'superadmin@jobportal.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });

    await superAdmin.save();
    console.log('Super admin created successfully');
    console.log('Email: superadmin@jobportal.com');
    console.log('Password: superadmin123');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createSuperAdmin(); 