import mongoose from "mongoose";
import User from './models/user.js';
import dotenv from "dotenv";
dotenv.config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Delete old admin emails
        const oldAdmins = await User.deleteMany({ 
            email: { $in: ["admin@system.com", "agborboniventure@gmail.com"] }
        });
        if (oldAdmins.deletedCount > 0) {
            console.log(`❌ Deleted ${oldAdmins.deletedCount} old admin(s)`);
        }

        // Check if new admin exists
        const newAdminEmail = process.env.SEED_ADMIN_EMAIL || "ngakoboniventure@gmail.com";
        const newAdmin = await User.findOne({ email: newAdminEmail });

        if (!newAdmin) {
            // Create new admin
            const admin = await User.create({
                name: "Main Admin",
                email: newAdminEmail,
                password: process.env.SEED_ADMIN_PASS || "Admin123!",
                role: "admin"
            });
            console.log("✅ Created new admin:", admin.email);
        } else {
            // Update existing to ensure it has admin role
            newAdmin.role = "admin";
            await newAdmin.save();
            console.log("✅ Admin already exists:", newAdmin.email);
        }

        console.log("\n🎉 Admin email updated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

updateAdmin();
