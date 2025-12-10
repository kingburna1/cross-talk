import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    productName: { type: String, required: true },
    maxDeliveryTime: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    supplierEmail: { type: String, required: true },
    firstContact: { type: String, required: true },
    secondContact: String,
}, { timestamps: true });

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
export default Supplier;
