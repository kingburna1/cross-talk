# SMS Notifications Setup Guide

## Overview
Your notification system now supports **three channels**:
1. 🔔 **Toast notifications** (immediate UI alerts)
2. 📧 **Email notifications** (sent to admin email)
3. 📱 **SMS notifications** (sent to admin phone)

## Setup Instructions

### Step 1: Get Your Brevo API Key
1. Go to [Brevo Dashboard](https://app.brevo.com)
2. Navigate to **Settings > SMTP & API > API Keys**
3. Create a new API key (or use existing)
4. Copy the API key (looks like: `xkeysib-xxxxxxxxxxxxx`)

### Step 2: Verify Your Phone Number AND Sender Name
1. In Brevo dashboard, go to **Transactional > SMS**
2. **Important:** You need to:
   - **Verify your sender name** (e.g., "CrossTalk" or your business name)
   - **Verify your phone number** (+237XXXXXXXXX format)
   - **Add SMS credits** to your account
3. Click on **Senders** section
4. Add sender name and submit for verification (may take 24-48 hours)
5. Add and verify your phone number (you'll receive verification code)
6. Purchase SMS credits if needed

**Note:** Brevo requires sender name approval before sending SMS. This is a regulatory requirement.

### Step 3: Update Environment Variables
Open `server/.env` and update these lines:

```env
# Brevo API for SMS
BREVO_API_KEY=xkeysib-your-actual-api-key-here
ADMIN_PHONE_NUMBER=+237XXXXXXXXX
```

**Important:** 
- Phone number MUST be in international format with country code (+237 for Cameroon)
- No spaces or special characters except the + sign
- Example: `+237612345678`

### Step 4: Test SMS System
Run the test script to verify everything works:

```bash
cd server
node testSMS.js
```

Expected output:
```
✅ BREVO API Key: Set
✅ Admin Phone: +237XXXXXXXXX
📱 Sending test SMS...
✅ SMS sent successfully to +237XXXXXXXXX
📱 Message ID: xxxxx
```

### Step 5: Restart Your Server
After configuring, restart your backend server:

```bash
cd server
npm run dev
```

## What Triggers SMS Notifications?

SMS notifications are sent for:

1. **Low Stock Alerts** (⚠️ Warning)
   - When any product stock drops to 10 units or below
   - Example: "⚠️ Low Stock Alert: Product 'Rice' stock is low! Only 8 units remaining."

2. **New Products Added** (✅ Success)
   - When a new product is added to inventory
   - Example: "✅ New Product Added: Product 'Milk' has been successfully added to inventory with 100 units at 500 FCFA each."

3. **New Suppliers Added** (ℹ️ Info)
   - When a new supplier is registered
   - Example: "ℹ️ New Supplier Added: Supplier 'ABC Foods' has been added. Supplies: Rice, Delivery: 2 days."

4. **Sales Completed** (✅ Success)
   - When a sale is recorded
   - Example: "✅ New Sale Completed: Sale to John Doe completed successfully. 3 item(s) sold for 15000 FCFA."

## SMS Message Format

SMS messages are automatically:
- Limited to 160 characters (SMS standard)
- Prefixed with emoji based on notification type
- Truncated with "..." if too long

## Costs & Limits

**Brevo SMS Pricing:**
- Cameroon SMS: Check current rates on Brevo dashboard
- Charged per SMS sent
- Free tier may have limits

**Recommendation:** 
- SMS is sent for critical notifications only
- Email is unlimited and free
- Consider SMS for urgent alerts (low stock) only if budget is a concern

### Troubleshooting

### "Invalid Request" Error (500)
This is the most common error and means:
1. **Sender name not verified** - Go to Brevo > SMS > Senders and verify "CrossTalk" (or change sender name in code)
2. **SMS not enabled** - Your Brevo plan may not include SMS
3. **No SMS credits** - You need to purchase SMS credits
4. **Phone number format** - Must be +237XXXXXXXXX (no spaces)

**Quick Fix:** While waiting for sender verification, you can try:
- Use Brevo's default sender if available
- Or temporarily disable SMS (keep email only)

### SMS not sending?
1. Check API key is correct in `.env`
2. Verify phone number format: +237XXXXXXXXX (no spaces)
3. Ensure phone number is verified in Brevo dashboard
4. Check Brevo account has SMS credits
5. Review console logs for error messages

### Phone not verified?
1. Log into Brevo dashboard
2. Go to SMS section
3. Add your phone number
4. Enter verification code received via SMS
5. Wait for approval (may take a few minutes)

### API key invalid?
1. Regenerate API key in Brevo dashboard
2. Make sure you're using the API key (not SMTP password)
3. API keys look like: `xkeysib-xxxxxxxxxx`

## Testing Individual Components

Test just the SMS system:
```bash
node server/testSMS.js
```

Test just the email system:
```bash
node server/testEmail.js
```

## Disabling SMS (Keep Email Only)

If you want to keep email but disable SMS:
1. Leave `BREVO_API_KEY` or `ADMIN_PHONE_NUMBER` as placeholder values
2. SMS will automatically be skipped (no errors)
3. Email notifications will continue working

## Support

- Brevo Documentation: https://developers.brevo.com/docs/send-a-transactional-sms
- Brevo SMS API: https://developers.brevo.com/reference/sendtransacsms
- Check server console logs for detailed error messages
