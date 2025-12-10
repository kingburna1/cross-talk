import { sendEmail } from "./email.js";

/**
 * Send notification email to admin
 * @param {Object} notification - The notification object
 * @param {string} notification.type - Type of notification (success, warning, error, info)
 * @param {string} notification.title - Notification title
 * @param {string} notification.message - Notification message
 */
export const sendNotificationEmail = async (notification) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        
        if (!adminEmail) {
            console.warn("⚠️ ADMIN_EMAIL not configured, skipping notification email");
            return null;
        }

        const { type, title, message } = notification;

        // Determine email styling based on notification type
        const getTypeStyles = (type) => {
            switch (type) {
                case 'success':
                    return { color: '#10B981', emoji: '✅', bgColor: '#D1FAE5' };
                case 'warning':
                    return { color: '#F59E0B', emoji: '⚠️', bgColor: '#FEF3C7' };
                case 'error':
                    return { color: '#EF4444', emoji: '❌', bgColor: '#FEE2E2' };
                case 'info':
                default:
                    return { color: '#3B82F6', emoji: 'ℹ️', bgColor: '#DBEAFE' };
            }
        };

        const { color, emoji, bgColor } = getTypeStyles(type);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: ${color}; padding: 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                            Cross-Talk Supermarket
                                        </h1>
                                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                                            System Notification
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Notification Badge -->
                                <tr>
                                    <td style="padding: 20px; background-color: ${bgColor}; text-align: center;">
                                        <div style="font-size: 48px; margin-bottom: 10px;">${emoji}</div>
                                        <h2 style="margin: 0; color: ${color}; font-size: 24px; font-weight: bold;">
                                            ${title}
                                        </h2>
                                    </td>
                                </tr>
                                
                                <!-- Message Content -->
                                <tr>
                                    <td style="padding: 30px;">
                                        <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                            ${message}
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Timestamp -->
                                <tr>
                                    <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                            <strong>Time:</strong> ${new Date().toLocaleString('fr-CM', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false,
                                                timeZone: 'Africa/Douala'
                                            })}
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px; background-color: #1f2937; text-align: center;">
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                            This is an automated notification from Cross-Talk Supermarket Management System
                                        </p>
                                        <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                                            © ${new Date().getFullYear()} Cross-Talk Supermarket. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        const textContent = `
${emoji} ${title}

${message}

Time: ${new Date().toLocaleString('fr-CM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Africa/Douala'
})}

---
This is an automated notification from Cross-Talk Supermarket Management System
© ${new Date().getFullYear()} Cross-Talk Supermarket. All rights reserved.
        `.trim();

        await sendEmail({
            to: adminEmail,
            subject: `${emoji} ${title} - Cross-Talk Supermarket`,
            html: htmlContent,
            text: textContent
        });

        console.log(`📧 Notification email sent to admin: ${title}`);
        return true;
    } catch (error) {
        console.error("❌ Failed to send notification email:", error.message);
        // Don't throw error - we don't want email failures to break the notification system
        return false;
    }
};
