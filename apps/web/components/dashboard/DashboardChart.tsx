"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { mes: "Jan", empresas: 4 },
  { mes: "Fev", empresas: 5 },
  { mes: "Mar", empresas: 6 },
  { mes: "Abr", empresas: 7 },
  { mes: "Mai", empresas: 8 },
  { mes: "Jun", empresas: 10 },
];

export default function DashboardChart() {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 16,
            right: 12,
            left: -18,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="empresasGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#1e293b"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{
              stroke: "#475569",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#f8fafc",
            }}
            labelStyle={{
              color: "#cbd5e1",
            }}
          />

          <Area
            type="monotone"
            dataKey="empresas"
            name="Empresas"
            stroke="#818cf8"
            strokeWidth={3}
            fill="url(#empresasGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}