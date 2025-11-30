'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Or solid

const notificationVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } }
};

const NotificationCard = ({ notification, onDismiss, onViewMore }) => {
  const { id, type, title, message, timestamp, isRead = false } = notification;
  const [showFullMessage, setShowFullMessage] = useState(false);

  // Determine icon and color based on notification type
  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircleIcon, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'warning':
        return { icon: ExclamationTriangleIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      case 'error':
        return { icon: XMarkIcon, color: 'text-red-600', bgColor: 'bg-red-50' };
      case 'info':
      default:
        return { icon: InformationCircleIcon, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
  };

  const { icon: Icon, color, bgColor } = getNotificationStyles(type);

  // Format timestamp (e.g., "2 hours ago" or "Jan 1, 2024, 10:30 AM")
  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleString(); // Fallback for older notifications
  };

  const shortMessage = message.length > 100 ? message.substring(0, 97) + '...' : message;
  const showViewMoreButton = message.length > 100 && !showFullMessage;

  const handleViewMoreClick = () => {
    setShowFullMessage(true);
    if (onViewMore) {
      onViewMore(id); // Optional callback for parent
    }
  };

  return (
    <motion.div
      variants={notificationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 mb-3 rounded-lg shadow-sm transition-all duration-300 ${
        isRead ? 'bg-gray-100 border-gray-200' : `${bgColor} border-gray-300`
      } border`}
    >
      {/* Icon and Title */}
      <div className="flex items-center shrink-0 mb-3 md:mb-0 md:pr-4">
        <Icon className={`w-6 h-6 mr-3 ${color}`} />
        <h4 className="text-base font-semibold text-gray-800">{title}</h4>
      </div>

      {/* Message Preview / Full Message */}
      <div className="grow min-w-0 px-0 md:px-4 mb-3 md:mb-0 border-b md:border-b-0 md:border-x border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed py-2">
          {showFullMessage ? message : shortMessage}
        </p>
        {showViewMoreButton && (
          <button
            onClick={handleViewMoreClick}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-1 mb-2 md:mb-0"
          >
            View More
          </button>
        )}
      </div>

      {/* Timestamp and Dismiss Button */}
      <div className="flex flex-col items-start md:items-end shrink-0 ml-0 md:ml-4 text-left md:text-right">
        <span className="text-xs text-gray-500 mb-2 md:mb-0">
          {formatTimestamp(timestamp)}
        </span>
        {onDismiss && (
          <button
            onClick={() => onDismiss(id)}
            className="mt-2 md:mt-0 p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors duration-150"
            aria-label="Dismiss notification"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationCard;