'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Pre-defined Admin Remarks
const ADMIN_REMARKS = [
  "We will fix that. Thank you.",
  "Products now available.",
  "Sorry, we can't fulfill this request.",
  "Issue forwarded to technical team.",
  "A representative will contact you shortly.",
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ClientMessageCard = ({ messageData, onRemarkSubmit }) => {
  const { id, senderName, subject, message, timestamp, isResolved = false, adminRemark } = messageData;
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Truncate message for preview
  const shortMessage = message.length > 120 ? message.substring(0, 117) + '...' : message;
  const showViewMoreButton = message.length > 120 && !showFullMessage;

  const handleSubmitRemark = () => {
    if (!selectedRemark || isSubmitting) return;

    setIsSubmitting(true);
    // **TODO:** Replace with actual API call
    setTimeout(() => {
      onRemarkSubmit(id, selectedRemark);
      setIsSubmitting(false);
      setSelectedRemark(''); // Clear selection after submit
    }, 500);
  };

  const handleToggleMessage = () => {
    setShowFullMessage(prev => !prev);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col w-full p-4 mb-3 rounded-lg shadow-md transition-all duration-300 border ${
        isResolved ? 'bg-gray-100 border-green-300' : 'bg-white border-gray-200 hover:shadow-lg'
      }`}
    >
      {/* --- Top Row: Sender Info and Status (Always Horizontal) --- */}
      <div className="flex items-center justify-between border-b pb-3 mb-3">
        <div className="flex items-center">
          <UserIcon className="w-5 h-5 text-indigo-500 mr-2" />
          <span className="font-semibold text-gray-800 mr-4 truncate">{senderName}</span>
          <span className="text-sm font-medium text-gray-500 hidden sm:block">| Subject: {subject}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {isResolved && (
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Resolved
            </span>
          )}
          <span className="text-xs text-gray-400">{new Date(timestamp).toLocaleString()}</span>
        </div>
      </div>

      {/* --- Content Row: Message Preview and Remark Section (Responsive) --- */}
      <div className="flex flex-col lg:flex-row justify-between">
        
        {/* 1. Message Content (Takes up maximum space) */}
        <div className="message-content lg:w-3/5 xl:w-2/3 pr-0 lg:pr-6 mb-4 lg:mb-0">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {showFullMessage ? message : shortMessage}
          </p>
          {(showViewMoreButton || showFullMessage) && (
            <button
              onClick={handleToggleMessage}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
            >
              {showFullMessage ? 'View Less' : 'View More Message'}
            </button>
          )}
          
          {/* Display Admin's Past Remark */}
          {adminRemark && (
            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                <span className="text-xs font-medium text-indigo-700">Admin Remark:</span>
                <p className="text-sm text-indigo-800">{adminRemark}</p>
            </div>
          )}
        </div>

        {/* 2. Admin Remark Submission */}
        <div className="admin-remark lg:w-2/5 xl:w-1/3 pt-4 lg:pt-0 lg:border-l lg:pl-6 border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 mr-1 text-red-500" />
            Quick Remark
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {ADMIN_REMARKS.map((remark, index) => (
              <button
                key={index}
                onClick={() => setSelectedRemark(remark)}
                disabled={isResolved || isSubmitting}
                className={`text-xs px-3 py-1 rounded-full transition duration-150 ${
                  selectedRemark === remark 
                    ? 'bg-red-600 text-white font-bold' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${isResolved ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {remark}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmitRemark}
            disabled={!selectedRemark || isResolved || isSubmitting}
            className={`w-full py-2 rounded-md font-semibold text-white transition duration-150 ${
              !selectedRemark || isResolved || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : isResolved ? 'Remark Sent' : 'Send Remark'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientMessageCard;