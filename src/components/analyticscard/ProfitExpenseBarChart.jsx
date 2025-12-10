// src/components/charts/ProfitExpenseBarChart.jsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Jan', 'Gross Profit': 15000, Expenses: 8000 },
    { name: 'Feb', 'Gross Profit': 18500, Expenses: 9200 },
    { name: 'Mar', 'Gross Profit': 16000, Expenses: 8800 },
    { name: 'Apr', 'Gross Profit': 22000, Expenses: 11000 },
    { name: 'May', 'Gross Profit': 19500, Expenses: 9500 },
];

const ProfitExpenseBarChart = () => (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis unit=" FCFA" stroke="#6b7280" />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Value']} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Gross Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default ProfitExpenseBarChart;