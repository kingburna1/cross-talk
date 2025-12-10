"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PlusIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react"; // Added this hook, which was mentioned in the error stack
import { showErrorToast } from "../../lib/toast";

import EmployeeCard from "./EmployeeCard";
import AddEmployeeForm from "./AddEmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";
import { useSearchStore } from "../../store/searchStore";

// Updated: Using valid placeholder URLs for images
const dummyEmployees = [
    {
        id: 1,
        image: "/image2.jpg",
        name: "Alex Johnson",
        age: 32,
        phone: "555-0123",
        email: "alex.j@example.com",
        dateEmployed: "2020-08-15",
        post: "Senior Sales Manager",
        salary: 65000, // Annual Salary
        paymentMeans: "Bank Transfer (Monthly)",
    },
    {
        id: 2,
        image: "/image2.jpg",
        name: "Sarah Chen",
        age: 25,
        phone: "555-0456",
        email: "sarah.c@example.com",
        dateEmployed: "2023-01-20",
        post: "Inventory Specialist",
        salary: 42000, // Annual Salary
        paymentMeans: "Mobile Pay (Bi-Weekly)",
    },
    {
        id: 3,
        image: "/image2.jpg",
        name: "Michael B.",
        age: 45,
        phone: "555-0789",
        email: "michael.b@example.com",
        dateEmployed: "2019-05-10",
        post: "Store Supervisor",
        salary: 78000, // Annual Salary
        paymentMeans: "Bank Transfer (Monthly)",
    },
];

// Helper function for currency formatting
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CFA",
    }).format(amount);
};

const EmployeesManagement = () => {
    // ------------------------------------------------------------------
    // 🛑 ALL HOOKS MUST BE DEFINED HERE, BEFORE ANY CONDITIONAL LOGIC 🛑
    // ------------------------------------------------------------------

    // 1-4. useState
    const [employees, setEmployees] = useState([]);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get search state (This was the hook that was previously conditional)
    const { search } = useSearchStore();

    // 5. useEffect - Load employees from backend MongoDB
    useEffect(() => {
        const loadFromServer = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/employees`,
                    { credentials: "include" }
                );

                console.log("Fetch /api/employees status:", res.status);

                if (!res.ok) {
                    console.error("Failed to fetch employees:", await res.text());
                    setIsLoading(false);
                    return;
                }

                const dbEmployees = await res.json();
                console.log("Fetched employees:", dbEmployees);

                // Map employees to include id field from _id
                const mapped = dbEmployees.map(e => ({
                    ...e,
                    id: e._id,
                }));

                setEmployees(mapped);
            } catch (err) {
                console.error("Network error loading employees:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadFromServer();
    }, []);

    // --- SEARCH FILTERING LOGIC (useMemo must be here) ---
    // 6. useMemo
    const filteredEmployees = useMemo(() => {
        if (!search) {
            return employees; // Show the full employee list
        }

        const lowerCaseSearch = search.toLowerCase();

        return employees.filter(employee =>
            // Filter logic: Check if the employee's name or post includes the search text
            employee.name.toLowerCase().includes(lowerCaseSearch) ||
            employee.post.toLowerCase().includes(lowerCaseSearch)
        );
    }, [search, employees]); // Dependencies: search value and the list of employees

    // --- HANDLERS (using useCallback for stability, helps with hook tracking) ---

    // 1. ADD EMPLOYEE
    const handleEmployeeAdded = useCallback((newEmployee) => {
        const employeeWithId = {
            ...newEmployee,
            id: newEmployee._id,
        };
        setEmployees((prevEmployees) => [employeeWithId, ...prevEmployees]);
        setIsAddFormOpen(false);
    }, []);

    // 2. START EDITING
    const startEditing = useCallback((employee) => {
        setEditingEmployee(employee);
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        console.log("Deleting employee with id:", id);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/employees/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete employee");
            }

            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
            showErrorToast(`Failed to delete employee: ${error.message}`);
        }
    };

    // 3. UPDATE EMPLOYEE
    const handleEmployeeUpdated = useCallback((updatedEmployee) => {
        const employeeWithId = {
            ...updatedEmployee,
            id: updatedEmployee._id || updatedEmployee.id,
        };
        
        setEmployees((prevEmployees) => {
            const newEmployees = prevEmployees.map((e) =>
                e.id === employeeWithId.id ? employeeWithId : e
            );
            return newEmployees;
        });
        setEditingEmployee(null); // Close the edit form
    }, []);

    // --- CALCULATION LOGIC (useMemo) ---
    const { totalAnnualPayroll, totalMonthlyPayroll } = useMemo(() => {
        // Calculate payroll based on the *full* list, not the filtered one
        const totalAnnual = employees.reduce((sum, employee) => sum + employee.salary, 0);
        const totalMonthly = totalAnnual / 12;

        return {
            totalAnnualPayroll: totalAnnual,
            totalMonthlyPayroll: totalMonthly,
        };
    }, [employees]); // Dependency: full list of employees

    // ------------------------------------------------------------------
    // 🛑 END OF HOOKS AND START OF CONDITIONAL RENDERING / JSX 🛑
    // ------------------------------------------------------------------


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const MetricBlock = ({ title, amount, annual }) => (
        <div className="flex-1 min-w-[150px] p-3 rounded-lg bg-white shadow-md border border-gray-200">
            <div className="flex items-center text-gray-700">
                <CurrencyDollarIcon
                    className={`w-5 h-5 mr-2 ${
                        annual ? "text-green-600" : "text-indigo-600"
                    }`}
                />
                <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
            <p
                className={`text-xl sm:text-2xl font-bold mt-1 ${
                    annual ? "text-green-700" : "text-indigo-700"
                }`}
            >
                {formatCurrency(amount)}
            </p>
        </div>
    );

    if (isLoading) {
        return (
            <div className="p-5 text-center text-gray-500">
                Loading employee data...
            </div>
        );
    }
    
    // Check for empty results after filtering
    const showNoResults = filteredEmployees.length === 0 && search;
    
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Employee Directory ({filteredEmployees.length})
                </h1>
                {/* Button to Add New Employee */}
                <button
                    onClick={() => setIsAddFormOpen(true)}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add New Employee</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {search && (
                <p className="text-sm text-gray-500 mb-4">
                    Showing results for: <span className="font-semibold text-indigo-600">"{search}"</span>
                </p>
            )}

            {showNoResults ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <p className="text-lg font-medium text-red-500">
                        No employees found matching **"{search}"**.
                    </p>
                </div>
            ) : (
                <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* ✅ MAP OVER FILTERED EMPLOYEES */}
                    {filteredEmployees.map((employee) => (
                        <EmployeeCard
                            key={employee.id}
                            employee={employee}
                            onEdit={startEditing}
                            onDelete={handleDelete}
                        />
                    ))}
                </motion.div>
            )}

            <hr className="my-6 border-gray-300" />

            {/* --- TOTAL PAYROLL SUMMARY --- */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-2 text-red-500" />
                Payroll Financial Summary
            </h2>
            <div className="flex flex-wrap gap-4 justify-between">
                <MetricBlock
                    title="Total Monthly Payroll"
                    amount={totalMonthlyPayroll}
                    annual={false}
                />
                <MetricBlock
                    title="Total Annual Payroll"
                    amount={totalAnnualPayroll}
                    annual={true}
                />
            </div>

            {/* --- Modals --- */}

            {/* ADD EMPLOYEE MODAL */}
            {isAddFormOpen && (
                <AddEmployeeForm
                    onClose={() => setIsAddFormOpen(false)}
                    onEmployeeAdded={handleEmployeeAdded}
                />
            )}

            {/* EDIT EMPLOYEE MODAL */}
            {editingEmployee && (
                <EditEmployeeForm
                    employee={editingEmployee}
                    onClose={() => setEditingEmployee(null)}
                    onEmployeeUpdated={handleEmployeeUpdated}
                />
            )}
            
        </div>
    );
};

export default EmployeesManagement;