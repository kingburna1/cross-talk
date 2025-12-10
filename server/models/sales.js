import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    customer: {
        name: String,
        phone: String,
        notes: String,
    },
    lineItems: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: String,
        unitPrice: Number,
        quantity: Number,
        totalPrice: Number,
    }],
    summary: {
        subtotal: Number,
        discount: Number,
        tax: Number,
        grandTotal: Number,
        paymentMethod: String,
        amountPaid: Number,
        change: Number,
    },
    status: {
        type: String,
        enum: ['completed', 'cancelled', 'refunded'],
        default: 'completed'
    },
}, { timestamps: true });

const Sales = mongoose.models.Sales || mongoose.model('Sales', salesSchema);
export default Sales;
