/**
 * SMS Notification Utility using Brevo (Sendinblue) SMS API
 * Send SMS notifications for critical events
 */

import https from 'https';

let BREVO_API_KEY = null;
let ADMIN_PHONE = null;

/**
 * Initialize SMS service with environment variables
 */
function initializeSMS() {
  if (!BREVO_API_KEY) {
    BREVO_API_KEY = process.env.BREVO_API_KEY;
    ADMIN_PHONE = process.env.ADMIN_PHONE_NUMBER;
  }
}

/**
 * Send SMS using Brevo API
 * @param {string} phoneNumber - Recipient phone number (international format: +237...)
 * @param {string} message - SMS message content (max 160 chars recommended)
 * @returns {Promise<Object>} - SMS send result
 */
async function sendSMS(phoneNumber, message) {
  initializeSMS();

  if (!BREVO_API_KEY || BREVO_API_KEY === 'your_brevo_api_key_here') {
    console.log('⚠️  Brevo API key not configured. Skipping SMS...');
    return { success: false, reason: 'API key not configured' };
  }

  if (!phoneNumber || phoneNumber === 'your_phone_number_here') {
    console.log('⚠️  Admin phone number not configured. Skipping SMS...');
    return { success: false, reason: 'Phone number not configured' };
  }

  // Truncate message if too long (SMS limit is 160 chars for single SMS)
  const truncatedMessage = message.length > 160 
    ? message.substring(0, 157) + '...' 
    : message;

  const data = JSON.stringify({
    sender: 'Cross-Talk Supermarket',
    recipient: phoneNumber,
    content: truncatedMessage,
  });

  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/transactionalSMS/sms',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('📤 SMS Request:', {
    endpoint: 'https://api.brevo.com/v3/transactionalSMS/sms',
    sender: 'Cross-Talk Supermarket',
    recipient: phoneNumber,
    messageLength: truncatedMessage.length
  });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 201) {
            console.log(`✅ SMS sent successfully to ${phoneNumber}`);
            console.log(`📱 Message ID: ${response.messageId || 'N/A'}`);
            resolve({ success: true, data: response });
          } else {
            console.error(`❌ SMS failed: ${res.statusCode}`);
            console.error(`Response:`, JSON.stringify(response, null, 2));
            
            // Provide helpful error messages
            if (response.code === 'invalid_request') {
              console.error('\n💡 Common issues:');
              console.error('   1. Sender name not verified in Brevo');
              console.error('   2. Phone number format incorrect (use +237XXXXXXXXX)');
              console.error('   3. Brevo account needs SMS credits');
              console.error('   4. API key may not have SMS permissions');
            }
            
            resolve({ success: false, error: response, statusCode: res.statusCode });
          }
        } catch (error) {
          console.error('❌ Error parsing SMS response:', error);
          console.error('Raw response:', responseData);
          resolve({ success: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ SMS request error:', error);
      resolve({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

/**
 * Send notification SMS to admin
 * @param {Object} notification - Notification object with title and message
 * @returns {Promise<Object>} - SMS send result
 */
async function sendNotificationSMS(notification) {
  initializeSMS();

  if (!ADMIN_PHONE) {
    return { success: false, reason: 'Admin phone not configured' };
  }

  // Format SMS message (keep it short)
  const typeEmoji = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  const emoji = typeEmoji[notification.type] || '📢';
  const smsMessage = `${emoji} ${notification.title}: ${notification.message}`;

  return await sendSMS(ADMIN_PHONE, smsMessage);
}

export {
  sendSMS,
  sendNotificationSMS
};
