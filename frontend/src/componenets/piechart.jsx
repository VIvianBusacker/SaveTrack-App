import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./title";
import { formatCurrency } from "../libs/index"; // Import the formatCurrency function

const COLORS = ["#6ee7b7", "#fda4af"]; // Adjust colors for modern look

const DoughnutChart = ({ dt }) => {
  // Ensure income and expense are correctly passed
  const data = [
    { name: "Total Income", value: Number(dt?.income) },
    { name: "Total Expense", value: Number(dt?.expense) },
  ];

  // Custom tooltip to format income and expense
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="p-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded">
          <p>{`${name}: ${formatCurrency(value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center p-6 rounded-lg transition-all duration-300">
      <Title title="Summary" />
      <ResponsiveContainer width={"100%"} height={400}>
        <PieChart width={500} height={400}>
          <Tooltip content={<CustomTooltip />} /> {/* Apply custom tooltip */}
          <Legend wrapperStyle={{ color: "black", dark: { color: "white" } }} />
          <Pie
            data={data}
            innerRadius={110}
            outerRadius={170}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none" // Remove stroke for a smoother look
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
