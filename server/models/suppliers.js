import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: String,
    imageSrc: String,
    email: String,
    contact: String,
}, { timestamps: true });
const suppliers = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
export default suppliers;
