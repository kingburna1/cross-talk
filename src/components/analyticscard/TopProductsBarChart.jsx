// src/components/charts/TopProductsBarChart.jsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
    { name: 'Item A', Sales: 550 },
    { name: 'Item B', Sales: 420 },
    { name: 'Item C', Sales: 380 },
    { name: 'Item D', Sales: 290 },
    { name: 'Item E', Sales: 150 },
];

const TopProductsBarChart = () => (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical" // Vertical layout for better product name readability
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" interval={0} fontSize={12} />
                <Tooltip />
                <Bar dataKey="Sales" fill="#8884d8" radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default TopProductsBarChart;