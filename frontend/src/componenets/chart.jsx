import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./title";
import { formatCurrency } from "../libs/index"; // Import the formatCurrency function

const Chart = ({ data = [] }) => {
  // Ensure data consistency and check for the availability of data
  if (data.length === 0) {
    return null;
  }

  // Preprocess the data to ensure month names are used as labels
  const processedData = data.map((item) => {
    const monthName = new Date(item.date).toLocaleString("default", {
      month: "short",
    });
    return {
      ...item,
      label: monthName, // Use the short month name as the label
    };
  });

  // Custom tooltip to format income and expense
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { income, expense } = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded">
          <p>{`Monthly Income: ${formatCurrency(income)}`}</p>
          <p>{`Monthly Expense: ${formatCurrency(expense)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 w-full">
      <Title title="Transaction Activity" />

      <ResponsiveContainer width={"100%"} height={500} className="mt-5">
      <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} /> {/* Apply custom tooltip */}
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Monthly Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
            name="Monthly Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export { Chart };
