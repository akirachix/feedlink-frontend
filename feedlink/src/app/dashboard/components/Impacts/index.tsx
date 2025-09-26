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
    <div className="border rounded-lg p-2 sm:p-4 xl:p-8 w-full h-full min-h-[360px] flex flex-col justify-between">
      <div className="mb-2 sm:mb-4 xl:mb-6">
        <h2 className="text-base sm:text-2xl xl:text-3xl font-bold mb-1 xl:mb-4 text-[var(--primary-color)]">Impact Over Time</h2>
        <h5 className="text-xs sm:text-lg xl:text-xl">Food diverted</h5>
      </div>
      <div className="h-40 sm:h-56 xl:h-74 -ml-0 xl:-ml-2">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 15}
                  textAnchor="middle"
                  fill="#666"
                  fontSize={10}
                  data-testid={`x-axis-tick-${payload.value}`}
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis tick={{ fill: "#666", fontSize: 11 }} />
            <Tooltip wrapperStyle={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            <Bar dataKey="weight" fill="#006400" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}