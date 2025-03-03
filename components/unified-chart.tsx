import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Generate sample data
const generateChartData = () => {
  const data = [];
  const startDate = new Date(2025, 0, 15); // Jan 15, 2025
  const endDate = new Date(2025, 1, 14); // Feb 14, 2025

  // Start weight and goal weight
  const startWeight = 212;
  const goalWeight = 195;
  const targetDate = new Date(2025, 3, 15); // April 15, 2025

  // Calculate weight loss per day
  const totalDays = Math.round(
    (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weightLossPerDay = (startWeight - goalWeight) / totalDays;

  // Generate data for each day
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const daysSinceStart = Math.round(
      (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate expected weight based on goal trajectory
    const expectedWeight = startWeight - weightLossPerDay * daysSinceStart;

    // Add some random variation for actual weight
    const randomVariation = Math.random() * 1.5 - 0.75; // Between -0.75 and 0.75
    const actualWeight = expectedWeight + randomVariation;

    // Generate calorie data with some good (green) and bad (red) portions
    const calorieTarget = 1800;
    const goodCalories = Math.floor(Math.random() * 1200) + 400;
    const badCalories =
      Math.random() > 0.7 ? Math.floor(Math.random() * 600) : 0;

    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: parseFloat(actualWeight.toFixed(1)),
      goalTrajectory: parseFloat(expectedWeight.toFixed(1)),
      goalLine: 195, // The final goal weight as a reference line
      calorieTarget,
      goodCalories,
      badCalories,
      totalCalories: goodCalories + badCalories,
    });
  }

  return data;
};

export const UnifiedChart = () => {
  const data = generateChartData();
  const [view, setView] = useState<"weight" | "calories" | "combined">(
    "combined"
  );

  return (
    <div className="w-full h-full">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setView("combined")}
          className={`text-xs px-2 py-1 rounded ${
            view === "combined" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Combined
        </button>
        <button
          onClick={() => setView("weight")}
          className={`text-xs px-2 py-1 rounded ${
            view === "weight" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Weight
        </button>
        <button
          onClick={() => setView("calories")}
          className={`text-xs px-2 py-1 rounded ${
            view === "calories" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Calories
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        {view === "combined" ? (
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickMargin={5}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={["auto", "auto"]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
              stroke="#2563eb" // blue
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 2000]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
              stroke="#22c55e" // green
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "weight" || name === "goalTrajectory")
                  return [`${value} lbs`, name];
                return [`${value} cal`, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />

            {/* Weight data */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              name="weight"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="goalTrajectory"
              stroke="#2563eb"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={false}
              name="goalTrajectory"
            />
            <ReferenceLine
              yAxisId="left"
              y={195}
              stroke="#dc2626"
              strokeDasharray="3 3"
              label={{
                value: "Goal: 195 lbs",
                position: "insideTopRight",
                fontSize: 10,
              }}
            />

            {/* Calorie data */}
            <Bar
              yAxisId="right"
              dataKey="goodCalories"
              fill="#22c55e"
              stackId="calories"
              name="goodCalories"
            />
            <Bar
              yAxisId="right"
              dataKey="badCalories"
              fill="#ef4444"
              stackId="calories"
              name="badCalories"
            />
            <ReferenceLine
              yAxisId="right"
              y={1800}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: "Target: 1800 cal",
                position: "insideBottomRight",
                fontSize: 10,
              }}
            />
          </ComposedChart>
        ) : view === "weight" ? (
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickMargin={5} />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value, name) => [`${value} lbs`, name]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Weight"
            />
            <Line
              type="monotone"
              dataKey="goalTrajectory"
              stroke="#64748b"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={false}
              name="Goal Trajectory"
            />
            <ReferenceLine
              y={195}
              stroke="#dc2626"
              strokeDasharray="3 3"
              label={{
                value: "Goal: 195 lbs",
                position: "insideTopRight",
                fontSize: 10,
              }}
            />
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickMargin={5}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              domain={[0, 2000]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value, name) => [`${value} cal`, name]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="goodCalories"
              fill="#22c55e"
              stackId="calories"
              name="Good Calories"
            />
            <Bar
              dataKey="badCalories"
              fill="#ef4444"
              stackId="calories"
              name="Extra Calories"
            />
            <ReferenceLine
              y={1800}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: "Target: 1800 cal",
                position: "insideBottomRight",
                fontSize: 10,
              }}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
