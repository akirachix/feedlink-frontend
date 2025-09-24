"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Order } from '../../../utils/types/index';

interface ChartProps {
  orders: Order[];
}

export default function Chart({ orders }: ChartProps) {
  const calculateMonthlyData = (orders: Order[]) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sept", "Oct", "Nov", "Dec"
    ];

    const monthlyData = months.map(month => ({
      month,
      weight: 0,
      revenue: 0,
    }));

    for (const order of orders) {
      const date = new Date(order.created_at);
      const monthIndex = date.getMonth();
      if (monthIndex < 0 || monthIndex > 11) continue;

      const entry = monthlyData[monthIndex];
      entry.revenue += parseFloat(order.total_amount) || 0;

      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          entry.weight += item.quantity || 0;
        }
      }
    }

    return monthlyData;
  };

  const data = calculateMonthlyData(orders);

  return (
    <div className="border rounded-lg p-10 w-179">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4 text-[#006400]">Impact Over Time</h2>
        <h5 className="text-lg">Food diverted</h5>
      </div>
      <div className="h-74 -ml-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 15}
                  textAnchor="middle"
                  fill="#666"
                  data-testid={`x-axis-tick-${payload.value}`}
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis tick={{ fill: "#666" }} />
            <Tooltip wrapperStyle={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            <Bar dataKey="weight" fill="#006400" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
