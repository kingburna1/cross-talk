"use client";
import React from 'react'
import ClientMessageCard from '../../../src/components/messages/ClientMessageCard';

const handleRemarkSubmit = (messageId, remark) => {
  console.log(`Message ${messageId}: Admin submitted remark: ${remark}`);
  // **TODO:** Update your application state and make an API call here.
  // This should update the message status to resolved and save the remark.
};

const sampleMessage = {
  id: 'M001',
  senderName: 'Jane Doe (Client)',
  subject: 'Issue with recent order #4589',
  message: 'I received the package today, but the quantity of "Wireless Ergonomic Mouse" was incorrect. I ordered 10, but only received 8. Please advise on how to resolve this discrepancy as soon as possible.',
  timestamp: new Date().toISOString(),
  isResolved: false,
  adminRemark: null,
};

const page = () => {
  return (
    <div>
        <ClientMessageCard 
        messageData={sampleMessage} 
         onRemarkSubmit={handleRemarkSubmit}
        />
    </div>
  )
}

export default page
