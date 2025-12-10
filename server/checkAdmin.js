/**
 * Check Admin User
 * Run: node server/checkAdmin.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user...\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const targetEmail = process.env.SEED_ADMIN_EMAIL;
    console.log(`Looking for admin with email: ${targetEmail}`);

    // Find all users
    const allUsers = await User.find({});
    console.log(`\n📊 Total users in database: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('\n👥 All users:');
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} - Role: ${user.role} - Name: ${user.name}`);
      });
    }

    // Check if target admin exists
    const admin = await User.findOne({ email: targetEmail });
    
    if (admin) {
      console.log(`\n✅ Admin found!`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`\n   Try logging in with:`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${process.env.SEED_ADMIN_PASS}`);
    } else {
      console.log(`\n❌ Admin with email ${targetEmail} not found!`);
      console.log(`\n💡 Would you like to create the admin user?`);
      console.log(`   Run: node server/seedData.js`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
