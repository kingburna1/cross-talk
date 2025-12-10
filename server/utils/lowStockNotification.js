import Notification from "../models/notifications.js";
import { sendNotificationEmail } from "./notificationEmail.js";
import { sendNotificationSMS } from "./sms.js";

const LOW_STOCK_THRESHOLD = 10;

/**
 * Check if product stock is low and create notification if needed
 * @param {Object} product - The product to check
 * @returns {Object|null} - Returns notification object if created, null otherwise
 */
export const checkAndNotifyLowStock = async (product) => {
    try {
        if (!product || product.qtyLeft === undefined) {
            return null;
        }

        // Check if stock has reached or dropped below threshold
        if (product.qtyLeft <= LOW_STOCK_THRESHOLD) {
            const now = new Date().toISOString();

            // Check if we already have a recent notification for this product
            const recentNotification = await Notification.findOne({
                type: "warning",
                title: "Low Stock Alert",
                message: { $regex: product.name, $options: 'i' }
            }).sort({ createdAt: -1 });

            // Only create new notification if no recent one exists (within last hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (!recentNotification || new Date(recentNotification.createdAt) < oneHourAgo) {
                const notificationData = {
                    type: "warning",
                    title: "Low Stock Alert",
                    message: `Product "${product.name}" stock is low! Only ${product.qtyLeft} units remaining. Please restock soon.`,
                    timestamp: now,
                    isRead: false
                };

                const notification = await Notification.create(notificationData);

                // Send email notification to admin
                sendNotificationEmail(notificationData).catch(err => 
                    console.error("Email notification failed:", err.message)
                );

                // Send SMS notification to admin
                sendNotificationSMS(notificationData).catch(err =>
                    console.error("SMS notification failed:", err.message)
                );

                console.log(`⚠️ Low stock notification created for: ${product.name} (${product.qtyLeft} left)`);
                return notification;
            }
        }

        return null;
    } catch (error) {
        console.error("Error creating low stock notification:", error);
        return null;
    }
};

/**
 * Check multiple products for low stock
 * @param {Array} products - Array of products to check
 * @returns {Array} - Array of created notifications
 */
export const checkMultipleProductsLowStock = async (products) => {
    const notifications = [];
    
    for (const product of products) {
        const notification = await checkAndNotifyLowStock(product);
        if (notification) {
            notifications.push(notification);
        }
    }
    
    return notifications;
};
