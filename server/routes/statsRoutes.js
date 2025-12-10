// /server/routes/statsRoutes.js
import express from 'express';
import Product from '../models/products.js';
import Sales from '../models/sales.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET admin statistics
router.get('/admin', authenticate, isAdmin, async (req, res) => {
  try {
    // Get all products
    const products = await Product.find();
    const totalProductsPosted = products.length;

    // Get all sales
    const sales = await Sales.find();

    // Calculate total revenue from sales
    let totalRevenue = 0;
    let totalCost = 0;

    sales.forEach(sale => {
      totalRevenue += sale.totalAmount || 0;
      
      // Calculate cost based on items sold
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const product = products.find(p => 
            p._id.toString() === (item.productId ? item.productId.toString() : '') || 
            p.name === item.productName
          );
          if (product) {
            totalCost += (product.buyPrice || 0) * (item.quantity || 0);
          }
        });
      }
    });

    // Calculate net profit
    const netProfit = totalRevenue - totalCost;

    // Calculate total loss (cost of out-of-stock or depleted inventory)
    const totalLoss = products.reduce((sum, product) => {
      if (product.qtyLeft <= 0 && product.qtyBought > 0) {
        // If product is completely sold out, calculate what was invested
        const invested = (product.buyPrice || 0) * (product.qtyBought || 0);
        // If sold completely, check if sales covered the cost
        return sum;
      }
      return sum;
    }, 0);

    // Better loss calculation: unsold inventory value
    const unsoldInventoryValue = products.reduce((sum, product) => {
      if (product.qtyLeft > 0) {
        return sum + ((product.buyPrice || 0) * product.qtyLeft);
      }
      return sum;
    }, 0);

    res.json({
      totalProductsPosted,
      netProfit,
      totalLoss: unsoldInventoryValue, // Value tied up in unsold inventory
      totalRevenue,
      totalCost,
      unsoldInventoryValue
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
