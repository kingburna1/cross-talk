'use client';
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import NotificationCard from './NotificationCard';
import { showErrorToast } from '../../lib/toast';

const DashboardNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/notifications`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        
        // Transform data to match component format
        const transformedNotifications = data.map(notification => ({
          id: notification._id,
          type: notification.type || 'info',
          title: notification.title,
          message: notification.message,
          timestamp: notification.timestamp || notification.createdAt,
          isRead: notification.isRead || false,
        }));

        if (isMounted) {
          setNotifications(transformedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (isMounted) {
          showErrorToast("Failed to load notifications");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // First, fetch notifications
    fetchNotifications();

    // Then mark all as read (separate operation)
    const markAllAsRead = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/notifications/mark-all-read`,
          {
            method: 'PUT',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok && isMounted) {
          // Update local state to mark all as read
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          
          // Small delay before triggering event to ensure state is updated
          setTimeout(() => {
            window.dispatchEvent(new Event('notificationsViewed'));
          }, 100);
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    // Mark as read after a brief delay to ensure fetch completes first
    setTimeout(() => {
      if (isMounted) {
        markAllAsRead();
      }
    }, 500);

    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 300000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const dismissNotification = async (idToDismiss) => {
    try {
      // Optimistically remove from UI
      setNotifications(prev => prev.filter(n => n.id !== idToDismiss));

      // Delete from server
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/notifications/${idToDismiss}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      showErrorToast("Failed to dismiss notification");
    }
  };

  const markAsRead = async (idToRead) => {
    try {
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(n => n.id === idToRead ? { ...n, isRead: true } : n)
      );

      // Update on server
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/notifications/${idToRead}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isRead: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Activity Notifications
        </h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

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