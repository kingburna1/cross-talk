"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const initialFormState = {
  name: "",
  age: "",
  phone: "",
  email: "",
  dateEmployed: new Date().toISOString().substring(0, 10), // Default to today
  post: "",
  salary: "",
  paymentMeans: "Bank Transfer (Monthly)",
  image: "/image2.jpg", // Placeholder image
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const newEmployee = {
      ...formData,
      id: Date.now(),
      age: parseInt(formData.age, 10),
      salary: parseFloat(formData.salary),
    };

    onEmployeeAdded(newEmployee);

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
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
