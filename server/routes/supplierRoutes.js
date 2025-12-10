import express from "express";
import Supplier from "../models/suppliers.js";
import Notification from "../models/notifications.js";
import { sendNotificationEmail } from "../utils/notificationEmail.js";
import { sendNotificationSMS } from "../utils/sms.js";

const router = express.Router();

// GET all suppliers
router.get("/", async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create a new supplier
router.post("/", async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        const savedSupplier = await newSupplier.save();
        
        // Create notification for new supplier
        const now = new Date().toISOString();
        
        const notificationData = {
            type: "info",
            title: "New Supplier Added",
            message: `Supplier "${savedSupplier.name}" has been added. They supply ${savedSupplier.productName} with delivery time of ${savedSupplier.maxDeliveryTime}.`,
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
        
        res.status(201).json(savedSupplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update a supplier
router.put("/:id", async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        res.json(updatedSupplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a supplier
router.delete("/:id", async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        res.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
