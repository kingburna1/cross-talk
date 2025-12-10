"use client";
import React, { useState, useEffect } from "react";
import {
  UserCircleIcon,
  PencilIcon,
  BanknotesIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { toast } from "react-toastify";

const AdminProfileCard = ({ userData, statsData }) => {
  // State to manage edit mode for profile fields
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update profile with new image URL
      setProfile((prev) => ({ ...prev, imageSrc: data.secure_url }));
      
      // Save the image to backend immediately
      const updateResponse = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageSrc: data.secure_url })
      });

      if (updateResponse.ok) {
        toast.success('Profile image updated successfully!');
        // Trigger a custom event to update header
        window.dispatchEvent(new CustomEvent('profileUpdated', { 
          detail: { imageSrc: data.secure_url } 
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          timezone: profile.timezone,
          imageSrc: profile.imageSrc
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setProfile(data.user);
      setIsEditing(false);
      
      // Trigger a custom event to update header
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: { imageSrc: data.user.imageSrc } 
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for data validation/default values
  const safeStats = statsData || {};
  const totalProducts = safeStats.totalProductsPosted || 0;
  const netProfit = safeStats.netProfit || 0;
  const totalLoss = safeStats.totalLoss || 0;

  const profitClass = netProfit >= 0 ? "text-green-600" : "text-red-600";

  // --- Additional common profile fields ---
  const additionalFields = [
    {
      label: "Role",
      name: "role",
      value: profile.role || "Administrator",
      type: "text",
      readOnly: true,
    },
    {
      label: "Timezone",
      name: "timezone",
      value: profile.timezone || "WAT (+1 GMT)",
      type: "text",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <UserCircleIcon className="w-8 h-8 mr-3 text-indigo-600" />
        Admin Profile Settings
      </h1>

      {/* --- Main Grid Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Account Information
            </h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-lg flex items-center transition duration-150 ${
                isEditing
                  ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            {/* Use next/image in a real project, using div here for simplicity */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
              {profile.imageSrc ? (
                <Image
                  src={profile.imageSrc}
                  alt="Profile"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-20 h-20 text-gray-500" />
              )}
            </div>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('profileImageInput').click()}
              disabled={uploading}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:text-gray-400"
            >
              {uploading ? 'Uploading...' : 'Change Profile Image'}
            </button>
          </div>

          {/* Editable Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <InputField
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              isEditing={isEditing}
            />

            {/* Username */}
            <InputField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              isEditing={false}
              readOnly={true}
              type="email"
            />

            {/* Number */}
            <InputField
              label="Phone Number"
              name="phone"
              value={profile.phone || ''}
              onChange={handleInputChange}
              isEditing={isEditing}
              type="tel"
            />

            {/* Address */}
            <div className="md:col-span-2">
              <InputField
                label="Physical Address"
                name="address"
                value={profile.address || ''}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
            </div>

            {/* Other Fields */}
            {additionalFields.map((field) => (
              <InputField
                key={field.name}
                label={field.label}
                name={field.name}
                value={field.value}
                onChange={handleInputChange}
                isEditing={isEditing}
                type={field.type}
                readOnly={field.readOnly || !isEditing}
              />
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. Admin Business Metrics (Column 2) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <BanknotesIcon className="w-6 h-6 mr-2 text-yellow-600" />
              Business Performance
            </h2>

            {/* Products Posted */}
            <MetricCard
              title="Total Products Posted"
              value={totalProducts.toLocaleString()}
              icon={CubeIcon}
              color="bg-indigo-500"
            />

            {/* Profit Made */}
            <MetricCard
              title="Net Profit"
              value={`${Math.abs(netProfit).toFixed(0).toLocaleString()} FCFA`}
              icon={BanknotesIcon}
              color={netProfit >= 0 ? "bg-green-500" : "bg-red-500"}
              valueClass={profitClass}
            />

            {/* Amount Lost (Total Loss) */}
            <MetricCard
              title="Total Loss/Expenses"
              value={`${totalLoss.toFixed(0).toLocaleString()} FCFA`}
              icon={BanknotesIcon}
              color="bg-red-500"
              valueClass="text-red-600"
            />

            <div className="mt-4 text-sm text-gray-500 italic">
              *Figures updated real-time based on posted products and sales
              data.
            </div>
          </div>

          {/* 3. Other Profile Features (Security) */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Security & Access
            </h2>
            <ActionItem
              title="Change Password"
              description="Update your confidential access key."
            />
            <ActionItem
              title="Two-Factor Authentication (2FA)"
              description="Enable an extra layer of security."
            />
            <ActionItem
              title="View Activity Log"
              description="Review recent account activity and logins."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const InputField = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  readOnly = false,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={!isEditing || readOnly}
      className={`mt-1 block w-full border ${
        isEditing && !readOnly
          ? "border-indigo-500 bg-white"
          : "border-gray-300 bg-gray-50 text-gray-600"
      } rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
    />
  </div>
);

const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  valueClass = "text-gray-900",
}) => (
  <div className="flex items-center p-4 mb-3 rounded-lg border border-gray-100">
    <div className={`p-2 rounded-full mr-4 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  </div>
);

const ActionItem = ({ title, description }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0 flex justify-between items-center">
    <div>
      <p className="text-base font-medium text-indigo-700">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button className="text-indigo-500 hover:text-indigo-700 font-medium text-sm ml-4">
      Manage
    </button>
  </div>
);

// --- Example Usage Data ---
// Component to export for use in Next.js page
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('/api/users/me', {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const user = await userResponse.json();
        
        // Only proceed if user is admin
        if (user.role !== 'admin') {
          throw new Error('Access denied: Admin only');
        }
        
        setUserData(user);

        // Fetch stats from backend
        const statsResponse = await fetch('/api/stats/admin', {
          credentials: 'include'
        });

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch stats data');
        }

        const stats = await statsResponse.json();
        setStatsData(stats);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return <AdminProfileCard userData={userData} statsData={statsData} />;
};

export default ProfilePage;
