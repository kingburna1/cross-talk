// src/components/settings/StoreInfoForm.jsx
import React, { useState, useRef } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  TagIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const SectionHeader = ({ title, description }) => (
  <div className="border-b pb-2 mb-4">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const StoreInfoForm = () => {
  // State for managing the logo URL (for preview)
  const [logoUrl, setLogoUrl] = useState(
    "/image2.jpg"
  );
  // Ref to secretly click the file input
  const logoInputRef = useRef(null);

  const handleLogoUploadClick = () => {
    logoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload this file and get a URL back.
      // Here, we create a temporary URL for immediate preview.
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <SectionHeader
        title="Store Information"
        description="Configure basic contact, branding, and location details for your business."
      />

      {/* --- General Details --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Store Name */}
        <div>
          <label
            htmlFor="store-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Store Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="store-name"
              defaultValue="SuperPOS Store"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Store Logo Upload (NEW CLASSY DESIGN) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Logo
          </label>
          <div className="flex items-center space-x-4">
            {/* Current Logo Preview */}
            <div className="w-16 h-16 flex-none rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm bg-gray-50">
              <Image
                src={logoUrl}
                alt="Store Logo Preview"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if the placeholder URL is bad, though unlikely
                  e.target.src =
                    "https://placehold.co/100x100/1e293b/ffffff?text=LOGO";
                }}
              />
            </div>

            {/* Upload Button */}
            <div className="grow">
              <button
                type="button"
                onClick={handleLogoUploadClick}
                className="flex items-center justify-center px-4 py-2 w-full text-sm font-semibold rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition duration-150 border border-indigo-200 shadow-sm"
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                Change Logo
              </button>
              <p className="mt-1 text-xs text-gray-500 text-center md:text-left">
                Max size 2MB (PNG, JPG)
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              className="hidden" // Hiding the default input
            />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="address"
              defaultValue="123 Commerce Rd, City, Country"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* --- Contact & Hours --- */}
      <SectionHeader
        title="Contact and Operation"
        description="Define how customers can reach you and your working hours."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              defaultValue="+123 456 7890"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              defaultValue="contact@superpos.com"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Opening Hours */}
        <div>
          <label
            htmlFor="hours"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Daily Hours (e.g., 9:00 - 18:00)
          </label>
          <div className="relative">
            <input
              type="text"
              id="hours"
              defaultValue="08:00 - 20:00"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* --- Financial Settings --- */}
      <SectionHeader
        title="Financial and Currency"
        description="Set currency and standard tax rates for sales."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Currency Format
          </label>
          <div className="relative">
            <select
              id="currency"
              defaultValue="$"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="$">USD ($)</option>
              <option value="₦">NGN (₦)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
            </select>
            <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Tax Rate (VAT %, GST %) */}
        <div>
          <label
            htmlFor="tax"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tax Rate (VAT / GST %)
          </label>
          <div className="relative">
            <input
              type="number"
              id="tax"
              defaultValue="15"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>
      </div>

      {/* --- Save Button --- */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default StoreInfoForm;
