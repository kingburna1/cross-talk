import express from "express";
import Sales from "../models/sales.js";
import Product from "../models/products.js";
import Notification from "../models/notifications.js";
import { checkAndNotifyLowStock } from "../utils/lowStockNotification.js";
import { sendNotificationEmail } from "../utils/notificationEmail.js";
import { sendNotificationSMS } from "../utils/sms.js";

const router = express.Router();

// GET sales statistics
router.get("/stats", async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Total sales (year to date)
        const yearSales = await Sales.find({
            status: 'completed',
            createdAt: { $gte: startOfYear }
        });
        const totalSales = yearSales.reduce((sum, sale) => sum + (sale.summary?.grandTotal || 0), 0);

        // Today's sales
        const todaySales = await Sales.find({
            status: 'completed',
            createdAt: { $gte: startOfToday }
        });
        const todayTotal = todaySales.reduce((sum, sale) => sum + (sale.summary?.grandTotal || 0), 0);

        // Monthly revenue
        const monthSales = await Sales.find({
            status: 'completed',
            createdAt: { $gte: startOfMonth }
        });
        const monthlyRevenue = monthSales.reduce((sum, sale) => sum + (sale.summary?.grandTotal || 0), 0);

        // Average basket value (monthly)
        const avgBasketValue = monthSales.length > 0 ? monthlyRevenue / monthSales.length : 0;

        // Total transactions (year to date)
        const totalTransactions = yearSales.length;

        res.json({
            totalSales,
            todayTotal,
            monthlyRevenue,
            avgBasketValue,
            totalTransactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all sales
router.get("/", async (req, res) => {
    try {
        const sales = await Sales.find().sort({ createdAt: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single sale by ID
router.get("/:id", async (req, res) => {
    try {
        const sale = await Sales.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create a new sale (and update product quantities)
router.post("/", async (req, res) => {
    try {
        const { lineItems, ...saleData } = req.body;
        const lowStockNotifications = [];

        // Update product quantities and check for low stock
        for (const item of lineItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.qtyLeft = Math.max(0, product.qtyLeft - item.quantity);
                // Increment totalSold
                product.totalSold = (product.totalSold || 0) + item.quantity;
                await product.save();

                // Check if stock is low and create notification
                const notification = await checkAndNotifyLowStock(product);
                if (notification) {
                    lowStockNotifications.push(notification);
                }
            }
        }

        // Create sale record
        const newSale = new Sales({
            ...saleData,
            lineItems,
        });
        const savedSale = await newSale.save();
        
        // Create notification for new sale
        const now = new Date().toISOString();
        
        const totalAmount = savedSale.summary?.grandTotal || savedSale.summary?.total || 0;
        const itemCount = lineItems.length;
        const customerName = savedSale.customer?.name || 'Walk-in Customer';
        
        const notificationData = {
            type: "success",
            title: "New Sale Completed",
            message: `Sale to ${customerName} completed successfully. ${itemCount} item(s) sold for ${totalAmount.toLocaleString('fr-CM', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA.`,
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
        
        // Return sale data along with any low stock notifications
        res.status(201).json({
            sale: savedSale,
            lowStockNotifications
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update sale status (for cancellation/refund)
router.put("/:id", async (req, res) => {
    try {
        const updatedSale = await Sales.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSale) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.json(updatedSale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a sale (restore stock)
router.delete("/:id", async (req, res) => {
    try {
        const sale = await Sales.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "Sale not found" });
        }

        // Restore product quantities
        for (const item of sale.lineItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.qtyLeft += item.quantity;
                await product.save();
            }
        }

        await Sales.findByIdAndDelete(req.params.id);
        res.json({ message: "Sale deleted and stock restored successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
