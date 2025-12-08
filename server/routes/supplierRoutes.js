import express from "express";
import Supplier from "../models/suppliers.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const suppliers = await Supplier.find();
    res.json(suppliers);
});

export default router;
