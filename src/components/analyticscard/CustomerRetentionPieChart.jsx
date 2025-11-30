// src/components/charts/CustomerRetentionPieChart.jsx
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const data = [
    { name: 'Returning Customers', value: 7500 },
    { name: 'New Customers', value: 2500 },
];
const COLORS = ['#10b981', '#f59e0b']; // Green for Returning, Amber for New

const CustomerRetentionPieChart = () => (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} Customers`]} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export default CustomerRetentionPieChart;