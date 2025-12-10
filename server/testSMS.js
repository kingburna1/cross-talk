/**
 * Test SMS Notification System
 * Run: node server/testSMS.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendNotificationSMS } from './utils/sms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testSMS() {
  console.log('🧪 Testing SMS Notification System...\n');

  // Check environment variables
  console.log('📋 Configuration:');
  console.log(`   Brevo API Key: ${process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Admin Phone: ${process.env.ADMIN_PHONE_NUMBER || '❌ Missing'}`);
  console.log('');

  if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_api_key_here') {
    console.log('❌ Please set BREVO_API_KEY in your .env file');
    console.log('   Get it from: https://app.brevo.com/settings/keys/api');
    return;
  }

  if (!process.env.ADMIN_PHONE_NUMBER || process.env.ADMIN_PHONE_NUMBER === 'your_phone_number_here') {
    console.log('❌ Please set ADMIN_PHONE_NUMBER in your .env file');
    console.log('   Format: +237XXXXXXXXX (international format with country code)');
    return;
  }

  // Test notification
  const testNotification = {
    type: 'success',
    title: 'Test Notification',
    message: 'Your SMS notification system is working! 🎉'
  };

  console.log('📱 Sending test SMS...\n');
  const result = await sendNotificationSMS(testNotification);

  if (result.success) {
    console.log('\n✅ SMS test successful!');
    console.log('   Check your phone for the message.');
  } else {
    console.log('\n❌ SMS test failed!');
    console.log(`   Reason: ${result.reason || result.error || 'Unknown'}`);
    if (result.statusCode) {
      console.log(`   Status Code: ${result.statusCode}`);
    }
  }
}

testSMS().catch(error => {
  console.error('❌ Test error:', error);
  process.exit(1);
});
