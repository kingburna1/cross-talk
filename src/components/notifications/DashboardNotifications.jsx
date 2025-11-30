'use client';
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NotificationCard from './NotificationCard';

const initialNotifications = [
  {
    id: '1',
    type: 'success',
    title: 'New Product Posted',
    message: 'Luxury Smartwatch Pro X900 has been successfully added to your inventory. Stock level is now 50 units.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    isRead: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Wireless Ergonomic Mouse stock is critically low. Only 8 units remaining. Please reorder from Office Essentials Ltd. to avoid stockouts.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: '3',
    type: 'error',
    title: 'Price Mismatch Detected',
    message: 'A discrepancy was found in the pricing for "Advanced Gaming Keyboard". Buy price ($75.00) and sell price ($60.00) indicate a potential loss. Please review immediately.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    isRead: true, // Already read
  },
  {
    id: '4',
    type: 'info',
    title: 'New Supplier Contact Added',
    message: 'A new supplier, "Global Parts Inc.", has been successfully added to your supplier list with contact details and terms. You can now associate new products with this supplier.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: false,
  },
  {
    id: '5',
    type: 'info',
    title: 'Long Message Example Notification for Testing Responsiveness and View More Button',
    message: 'This is a much longer notification message designed to test the "View More" functionality. It contains a lot of details about a recent system update, including performance improvements, new reporting features, and security enhancements. Users should click the "View More" button to see the entire message without cluttering the initial view of the notification card. This ensures that even very verbose updates can be conveyed effectively without breaking the layout of the dashboard. Always remember to keep your users informed about critical changes or important system events.',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: false,
  },
];

const DashboardNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismissNotification = (idToDismiss) => {
    setNotifications(prev => prev.filter(n => n.id !== idToDismiss));
  };

  const markAsRead = (idToRead) => {
    setNotifications(prev => 
      prev.map(n => n.id === idToRead ? { ...n, isRead: true } : n)
    );
    // In a real app, you'd also make an API call to mark it as read on the server
  };

  return (
    <div className="bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Activity Notifications
      </h1>

      <div className="notification-list space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No new notifications. All clear! 🎉</p>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDismiss={dismissNotification}
                onViewMore={markAsRead} // Mark as read when "View More" is clicked
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DashboardNotifications;