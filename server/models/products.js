import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    imageSrc: String,
    name: String,
    buyPrice: Number,
    qtyBought: Number,
    supplierName: String,
    supplierContact: String,
    supplierEmail: String,
    sellPrice: Number,
    qtyLeft: Number,
}, { timestamps: true });

const Products = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Products;
