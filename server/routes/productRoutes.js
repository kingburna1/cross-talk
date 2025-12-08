import express from "express";
import Product from "../models/products.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

export default router;
