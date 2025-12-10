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
    totalSold: { type: Number, default: 0 },
    customerReview: { type: String, default: '' },
    reviewRating: { type: Number, default: 0, min: 0, max: 5 },
}, { timestamps: true });

const Products = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Products;
