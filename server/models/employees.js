import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    image: String,
    name: String,
    age: Number,
    phone: String,
    email: String,
    dateEmployed: String,
    post: String,
    salary: Number,
    paymentMeans: String,
}, { timestamps: true });

const Employees = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employees;
