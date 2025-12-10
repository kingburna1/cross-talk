import express from "express";
import Employee from "../models/employees.js";

const router = express.Router();

// GET all employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create a new employee
router.post("/", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update an employee
router.put("/:id", async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE an employee
router.delete("/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
