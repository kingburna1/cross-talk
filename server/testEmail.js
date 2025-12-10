import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

import { sendEmail, verifyTransporter } from './utils/email.js';

console.log('🔍 Testing SMTP Configuration...\n');

console.log('Environment Variables:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST);
console.log('  SMTP_PORT:', process.env.SMTP_PORT);
console.log('  SMTP_USER:', process.env.SMTP_USER);
console.log('  SMTP_PASS:', process.env.SMTP_PASS ? `${process.env.SMTP_PASS.substring(0, 20)}...` : 'NOT SET');
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('  FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('');

async function testEmail() {
    try {
        console.log('📧 Testing SMTP connection...');
        await verifyTransporter();
        console.log('✅ SMTP connection verified!\n');

        console.log('📧 Sending test email...');
        const result = await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: '✅ Test Email - Cross-Talk Supermarket',
            html: '<h1>Test Email</h1><p>If you receive this, your email notifications are working!</p>',
            text: 'Test Email - If you receive this, your email notifications are working!'
        });

        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', result.messageId);
        console.log('   Response:', result.response);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('   Error details:', error);
    }
}

testEmail();
