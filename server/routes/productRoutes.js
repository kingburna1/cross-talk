import express from "express";
import Product from "../models/products.js";
import Notification from "../models/notifications.js";
import { checkAndNotifyLowStock } from "../utils/lowStockNotification.js";
import { sendNotificationEmail } from "../utils/notificationEmail.js";
import { sendNotificationSMS } from "../utils/sms.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create a new product
router.post("/", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        
        // Create notification for new product
        const now = new Date().toISOString();
        
        const notificationData = {
            type: "success",
            title: "New Product Added",
            message: `Product "${savedProduct.name}" has been successfully added to inventory with ${savedProduct.qtyBought} units at ${savedProduct.sellPrice} FCFA each.`,
            timestamp: now,
            isRead: false
        };

        await Notification.create(notificationData);

        // Send email notification to admin
        sendNotificationEmail(notificationData).catch(err => 
            console.error("Email notification failed:", err.message)
        );

        // Send SMS notification to admin
        sendNotificationSMS(notificationData).catch(err =>
            console.error("SMS notification failed:", err.message)
        );
        
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update a product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if stock is low after update
        const notification = await checkAndNotifyLowStock(updatedProduct);
        
        res.json({
            product: updatedProduct,
            lowStockNotification: notification
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
