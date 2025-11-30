import React from "react";
import { motion } from "framer-motion";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";

const employeeCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DetailItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center text-gray-700 min-w-0 ${className}`}>
    <Icon className="w-4 h-4 mr-2 text-indigo-500 flex-none" />
    <span className="text-xs font-medium text-gray-500 flex-none mr-1 hidden sm:inline">
      {label}:
    </span>
    <span className="text-sm font-semibold truncate min-w-0" title={value}>
      {value}
    </span>
  </div>
);

const EmployeeCard = ({ employee }) => {
  const handleEdit = () => {
    alert(`Editing details for ${employee.name}`);
  };

  // Format currency and date
  const salaryFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(employee.salary);
  const dateEmployedFormatted = new Date(
    employee.dateEmployed
  ).toLocaleDateString();

  return (
    <motion.div
      variants={employeeCardVariants}
      className="flex flex-col bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full"
    >
      {/* --- 1. HEADER ROW (Image, Name, Age, Edit Button) --- */}
      <div className="flex items-start justify-between border-b pb-3 mb-3 border-gray-100">
        <div className="flex items-center min-w-0 grow">
          {/* Employee Image (Placeholder) */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full overflow-hidden flex-none mr-3 sm:mr-4">
                   <Image
                              src={employee.image}
                              width={56}
                              height={56}
                              alt={employee.name}
                              className="w-14 h-14 object-cover rounded-md mr-4 shrink-0"
                            />
          </div>

          {/* Name and Age (Stacks on smallest screen) */}
          <div className="flex flex-col min-w-0">
            <h2
              className="text-lg sm:text-xl font-extrabold text-gray-900 truncate"
              title={employee.name}
            >
              {employee.name}
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {employee.age} years old
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className="flex-none p-2 ml-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition duration-150"
          title="Edit Employee Information"
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
      </div>

      {/* --- 2. CONTACT & EMPLOYMENT DETAILS (Responsive Grid/Wrap) --- */}

      {/* Contact Details (Always visible) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 mb-3 border-gray-100">
        <div className="flex flex-wrap gap-y-2 gap-x-4 sm:gap-x-6">
          <DetailItem icon={PhoneIcon} label="Phone" value={employee.phone} />
          <DetailItem
            icon={EnvelopeIcon}
            label="Email"
            value={employee.email}
            className="min-w-0 grow basis-full sm:basis-auto"
          />
        </div>
      </div>

      {/* Employment and Salary Details (Stacks vertically, reveals details conditionally) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
        {/* DUTY/POST */}
        <DetailItem
          icon={BriefcaseIcon}
          label="Post"
          value={employee.post}
          className="col-span-1 md:col-span-2 order-1"
        />

        {/* DATE EMPLOYED */}
        <DetailItem
          icon={CalendarIcon}
          label="Employed"
          value={dateEmployedFormatted}
          className="col-span-1 order-2"
        />

        {/* SALARY */}
        <DetailItem
          icon={CurrencyDollarIcon}
          label="Salary"
          value={salaryFormatted}
          className="col-span-1 order-4 sm:order-3"
        />

        {/* PAYMENT MEANS */}
        <DetailItem
          icon={CreditCardIcon}
          label="Payment"
          value={employee.paymentMeans}
          className="col-span-1 md:col-span-2 order-3 sm:order-4"
        />
      </div>
    </motion.div>
  );
};

export default EmployeeCard;
