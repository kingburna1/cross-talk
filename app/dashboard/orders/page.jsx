import React from 'react';
import OrderCard from '../../../src/components/orderscard/OrderCard';

const sampleOrder = {
  orderId: 'ORD-98765',
  productName: 'Advanced Gaming Headset X5',
  quantity: 2,
  unitCost: 50.00,
  unitSalePrice: 85.00,
  customerInfo: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
  },
  deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001, United States',
  deliveryMethod: 'Express Shipping',
  orderNotes: 'Please leave package with the concierge. Do not ring the bell.',
};
const page = () => {
  return (
    <div>
      <OrderCard  order={sampleOrder} />
      
    </div>
  );
}

export default page;
