// src/components/charts/CategoryPieChart.jsx
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const data = [
    { name: 'Electronics', value: 40000 },
    { name: 'Accessories', value: 30000 },
    { name: 'Software', value: 20000 },
    { name: 'Services', value: 10000 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryPieChart = () => (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Revenue']} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '10px' }} />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export default CategoryPieChart;