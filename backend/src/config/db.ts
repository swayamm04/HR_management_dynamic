import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed initial admin if no users exist
        const User = (await import('../models/User.js')).default;
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.create({
                name: 'Admin User',
                email: 'admin@hrmanagement.com',
                password: '123456',
                role: 'Administrator'
            });
            console.log('Default Admin User created: admin@hrmanagement.com / 123456');
        }
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
