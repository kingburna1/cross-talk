// /server/models/EmployeeProfile.js
import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  image: String,
  age: Number,
  phone: String,
  dateEmployed: String,
  post: String,
  salary: Number,
  paymentMeans: String
}, { timestamps: true });
const EmployeeProfile = mongoose.models.Employee || mongoose.model('EmployeeProfile', employeeProfileSchema);
export default EmployeeProfile;
