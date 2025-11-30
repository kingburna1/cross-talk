// src/components/charts/SalesLineChart.jsx
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Week 1', Revenue: 5200, Expenses: 3100 },
    { name: 'Week 2', Revenue: 8100, Expenses: 4500 },
    { name: 'Week 3', Revenue: 7500, Expenses: 4000 },
    { name: 'Week 4', Revenue: 9800, Expenses: 5200 },
];

const SalesLineChart = () => (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis unit="$" />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]} />
                <Legend />
                <Line type="monotone" dataKey="Revenue" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="Expenses" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export default SalesLineChart;