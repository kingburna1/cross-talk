"use client";

import React, { useState, useRef } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { showErrorToast } from "../../lib/toast";

const initialFormState = {
  name: "",
  age: "",
  phone: "",
  email: "",
  dateEmployed: new Date().toISOString().substring(0, 10), // Default to today
  post: "",
  salary: "",
  paymentMeans: "Bank Transfer (Monthly)",
  image: "",
  imageFile: null,
};

// ✅ FIX: InputGroup is now defined OUTSIDE the main component.
// This prevents it from being destroyed and recreated on every keystroke.
const InputGroup = ({
  id,
  label,
  type = "text",
  required = false,
  min,
  step,
  icon: Icon,
  value,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && "*"}
    </label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value} // Value is now passed as a prop
        onChange={onChange} // Handler is now passed as a prop
        required={required}
        min={min}
        step={step}
        autoComplete="off"
        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  </div>
);

const AddEmployeeForm = ({ onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        image: url,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = '/image2.jpg'; // Default placeholder image
      
      // 1. Upload image to Cloudinary if a file was selected
      if (formData.imageFile) {
        try {
          console.log("📸 Attempting to upload image:", {
            name: formData.imageFile.name,
            type: formData.imageFile.type,
            size: formData.imageFile.size
          });

          const formDataToUpload = new FormData();
          formDataToUpload.append('file', formData.imageFile);
          
          console.log("🚀 Sending upload request to:", `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/upload`);
          
          const uploadResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/upload`,
            {
              method: "POST",
              credentials: "include",
              body: formDataToUpload,
            }
          );
          
          console.log("📡 Upload response status:", uploadResponse.status, uploadResponse.statusText);
          
          if (!uploadResponse.ok) {
            let errorMessage = "Failed to upload image";
            try {
              const errorData = await uploadResponse.json();
              console.error("❌ Upload failed with error:", errorData);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
              // Response is not JSON, get text instead
              const errorText = await uploadResponse.text();
              console.error("❌ Upload failed with text response:", errorText);
              errorMessage = errorText || `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
            }
            throw new Error(errorMessage);
          }
          
          const uploadResult = await uploadResponse.json();
          console.log("✅ Upload successful:", uploadResult.secure_url);
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("❌ Image upload error:", uploadError);
          showErrorToast(`Image upload failed: ${uploadError.message}. Using default image.`);
          // Continue with default image
        }
      }
      
      // 2. Prepare new employee object
      const newEmployee = {
        name: formData.name,
        age: parseInt(formData.age, 10),
        phone: formData.phone,
        email: formData.email,
        dateEmployed: formData.dateEmployed,
        post: formData.post,
        salary: parseFloat(formData.salary),
        paymentMeans: formData.paymentMeans,
        image: imageUrl,
      };

      // 3. Send to backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newEmployee),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add employee");
      }

      const savedEmployee = await response.json();
      onEmployeeAdded(savedEmployee);
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      showErrorToast(`Failed to add employee: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center">
            <UserIcon className="w-6 h-6 mr-2 text-indigo-500" />
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Image Upload Section */}
          <div className="flex flex-col items-center pb-4 border-b">
            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
              {formData.image ? (
                <img src={formData.image} alt="Employee Preview" className="w-full h-full object-cover" />
              ) : (
                <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-3 px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition"
            >
              {formData.image ? 'Change Photo' : 'Upload Photo'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              id="name"
              label="Full Name"
              icon={UserIcon}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputGroup
              id="age"
              label="Age"
              type="number"
              icon={CalendarIcon}
              value={formData.age}
              onChange={handleChange}
              required
              min="16"
            />
            <InputGroup
              id="phone"
              label="Phone Contact"
              icon={PhoneIcon}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <InputGroup
              id="email"
              label="Email Address"
              type="email"
              icon={EnvelopeIcon}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <InputGroup
              id="post"
              label="Position/Post"
              icon={BriefcaseIcon}
              value={formData.post}
              onChange={handleChange}
              required
            />
            <InputGroup
              id="dateEmployed"
              label="Date Employed"
              type="date"
              icon={CalendarIcon}
              value={formData.dateEmployed}
              onChange={handleChange}
              required
            />
            <InputGroup
              id="salary"
              label="Annual Salary ($)"
              type="number"
              icon={CurrencyDollarIcon}
              value={formData.salary}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />

            {/* Payment Means Select */}
            <div>
              <label
                htmlFor="paymentMeans"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Means
              </label>
              <div className="relative">
                <select
                  id="paymentMeans"
                  name="paymentMeans"
                  value={formData.paymentMeans}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option>Bank Transfer (Monthly)</option>
                  <option>Bank Transfer (Bi-Weekly)</option>
                  <option>Mobile Pay (Bi-Weekly)</option>
                  <option>Cash (Weekly)</option>
                </select>
                <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-6 py-2 font-semibold rounded-lg transition duration-150 ${
                isSaving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {isSaving ? "Saving..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
