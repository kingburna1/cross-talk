import Product from "../models/products.js";
import Employee from "../models/employees.js";
import Supplier from "../models/suppliers.js";
import Message from "../models/messages.js";
import Notification from "../models/notifications.js";
import User from '../models/user.js';

import EmployeeProfile from '../models/EmployeeProfile.js';

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const initialProducts = [
    {
        imageSrc: "/image1.jpg",
        name: "Luxury Smartwatch Pro X900",
        buyPrice: 50000,
        qtyBought: 50,
        supplierName: "TechCorp Global Inc.",
        supplierContact: "(555) 123-4567",
        supplierEmail: "contact@techcorp.com",
        sellPrice: 85000,
        qtyLeft: 12,
        totalSold: 38,
        customerReview: "This watch is excellent! Great battery life, sharp display, and very durable. The features are amazing for the price. Highly recommend!",
        reviewRating: 4.5,
    },
    {
        imageSrc: "/image2.jpg",
        name: "Wireless Ergonomic Mouse",
        buyPrice: 3000,
        qtyBought: 200,
        supplierName: "Budget Electronics Ltd",
        supplierContact: "(555) 987-6543",
        supplierEmail: "sales@budgetelec.co",
        sellPrice: 6500,
        qtyLeft: 98,
        totalSold: 102,
        customerReview: "Good mouse for everyday use. Comfortable grip and works smoothly. Good value for money.",
        reviewRating: 4.0,
    },
];

// create default admin if not exists
const ensureAdmin = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPass = process.env.SEED_ADMIN_PASS;
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const admin = await User.create({ name: 'Main Admin', email: adminEmail, password: adminPass, role: 'admin' });
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin exists:', adminEmail);
  }
};

// create a sample employee (user + profile)
const ensureSampleEmployee = async () => {
  const empEmail = 'alex.j@example.com';
  let user = await User.findOne({ email: empEmail });
  if (!user) {
    user = await User.create({ name: 'Alex Johnson', email: empEmail, password: 'Employee123!', role: 'employee' });
    console.log('Employee user created:', empEmail);
  }

  const existingProfile = await EmployeeProfile.findOne({ user: user._id });
  if (!existingProfile) {
    await EmployeeProfile.create({
      user: user._id,
      image: '/image2.jpg',
      age: 32,
      phone: '555-0123',
      dateEmployed: '2020-08-15',
      post: 'Senior Sales Manager',
      salary: 65000,
      paymentMeans: 'Bank Transfer (Monthly)'
    });
    console.log('Employee profile created for', empEmail);
  }
};

const sampleMessage = {
  senderName: 'Jane Doe (Client)',
  subject: 'Issue with recent order #4589',
  message:
    'I received the package today, but the quantity of "Wireless Ergonomic Mouse" was incorrect. I ordered 10, but only received 8.',
  timestamp: new Date().toISOString(),
  isResolved: false,
  adminRemark: null,
};
const initialNotifications = [
  {
    type: 'success',
    title: 'New Product Posted',
    message:
      'Luxury Smartwatch Pro X900 has been successfully added to your inventory.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    type: 'warning',
    title: 'Low Stock Alert',
    message:
      'Wireless Ergonomic Mouse stock is critically low. Only 8 units remaining.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
];


const dummyEmployees = [
    {
        image: "/image2.jpg",
        name: "Alex Johnson",
        age: 32,
        phone: "555-0123",
        email: "alex.j@example.com",
        dateEmployed: "2020-08-15",
        post: "Senior Sales Manager",
        salary: 65000,
        paymentMeans: "Bank Transfer (Monthly)",
    },
    {
        image: "/image2.jpg",
        name: "Sarah Chen",
        age: 25,
        phone: "555-0456",
        email: "sarah.c@example.com",
        dateEmployed: "2023-01-20",
        post: "Inventory Specialist",
        salary: 42000,
        paymentMeans: "Mobile Pay (Bi-Weekly)",
    },
    {
        image: "/image2.jpg",
        name: "Michael B.",
        age: 45,
        phone: "555-0789",
        email: "michael.b@example.com",
        dateEmployed: "2019-05-10",
        post: "Store Supervisor",
        salary: 78000,
        paymentMeans: "Bank Transfer (Monthly)",
    },
];

const initialSuppliers = [
    {
        name: "TechCorp Global Inc.",
        address: "123 Tech Street, Silicon Valley, CA 94025",
        productName: "Electronics & Smart Devices",
        maxDeliveryTime: "3-5 Business Days",
        pricePerUnit: 150.00,
        supplierEmail: "contact@techcorp.com",
        firstContact: "(555) 123-4567",
        secondContact: "(555) 123-4568",
    },
    {
        name: "Budget Electronics Ltd",
        address: "456 Commerce Ave, New York, NY 10001",
        productName: "Computer Accessories",
        maxDeliveryTime: "2-4 Business Days",
        pricePerUnit: 15.50,
        supplierEmail: "sales@budgetelec.co",
        firstContact: "(555) 987-6543",
        secondContact: "(555) 987-6544",
    },
    {
        name: "Global Foods Distributors",
        address: "789 Market Boulevard, Chicago, IL 60601",
        productName: "Packaged Foods & Beverages",
        maxDeliveryTime: "1-2 Business Days",
        pricePerUnit: 5.75,
        supplierEmail: "orders@globalfoods.com",
        firstContact: "(555) 456-7890",
        secondContact: "(555) 456-7891",
    },
    {
        name: "Fresh Produce Partners",
        address: "321 Farm Road, Portland, OR 97201",
        productName: "Fresh Fruits & Vegetables",
        maxDeliveryTime: "24-48 Hours",
        pricePerUnit: 2.50,
        supplierEmail: "supply@freshproduce.com",
        firstContact: "(555) 234-5678",
        secondContact: "",
    },
    {
        name: "Premium Beverages Co.",
        address: "567 Industrial Park, Miami, FL 33101",
        productName: "Soft Drinks & Juices",
        maxDeliveryTime: "2-3 Business Days",
        pricePerUnit: 1.25,
        supplierEmail: "sales@premiumbev.com",
        firstContact: "(555) 345-6789",
        secondContact: "(555) 345-6780",
    },
];



const seedDatabase = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();
    await Employee.deleteMany();
    await Supplier.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    await ensureAdmin();
    await ensureSampleEmployee();



    await Product.insertMany(initialProducts);
    await Employee.insertMany(dummyEmployees);
    await Supplier.insertMany(initialSuppliers);
    await Message.create(sampleMessage);
    await Notification.insertMany(initialNotifications);
    


    console.log("Database seeded successfully!");
    process.exit();
};

seedDatabase();
