// components/weight-chart.tsx
"use client";

import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// We'll use recharts for the visualization
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeightDataPoint {
  date: Date;
  weight: number;
}

// Create sample weight data for demo purposes
const generateSampleData = (): WeightDataPoint[] => {
  const data: WeightDataPoint[] = [];
  const today = new Date();

  // Generate 30 days of data with a slight downward trend
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);

    // Start at 180 lbs and gradually decrease with some random fluctuation
    const baseWeight = 180 - i * 0.1;
    const fluctuation = Math.random() * 1.4 - 0.7; // Random number between -0.7 and 0.7

    data.push({
      date,
      weight: parseFloat((baseWeight + fluctuation).toFixed(1)),
    });
  }

  return data;
};

// Format for tooltip
const formatTooltip = (value: number) => `${value} lbs`;

export function WeightChart() {
  const [weightData, setWeightData] = useState<WeightDataPoint[]>([]);
  const [goalWeight] = useState<number>(165);
  const [startWeight, setStartWeight] = useState<number>(180);

  useEffect(() => {
    // In a real app, we would fetch this data from the backend
    const data = generateSampleData();
    setWeightData(data);

    if (data.length > 0) {
      setStartWeight(data[0].weight);
    }
  }, []);

  // Format data for the chart
  const chartData = weightData.map((item) => ({
    date: format(item.date, "MMM dd"),
    weight: item.weight,
    // Add the goal weight as a flat line
    goal: goalWeight,
  }));

  // Get current weight (most recent data point)
  const currentWeight =
    weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;

  // Calculate progress percentage
  const totalWeightToLose = startWeight - goalWeight;
  const weightLostSoFar = startWeight - currentWeight;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (weightLostSoFar / totalWeightToLose) * 100)
  );

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Weight Progress</CardTitle>
        <CardDescription>
          {progressPercentage.toFixed(1)}% to goal (
          {(totalWeightToLose - weightLostSoFar).toFixed(1)} lbs to go)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0070f3" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#0070f3" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Show fewer labels on mobile
                  if (
                    typeof window !== "undefined" &&
                    window.innerWidth < 500
                  ) {
                    // Return empty string for some labels to reduce density
                    const index = chartData.findIndex((d) => d.date === value);
                    return index % 4 === 0 ? value : "";
                  }
                  return value;
                }}
              />
              <YAxis
                domain={[
                  Math.min(
                    goalWeight - 5,
                    Math.min(...weightData.map((d) => d.weight)) - 2
                  ),
                  Math.max(
                    startWeight + 5,
                    Math.max(...weightData.map((d) => d.weight)) + 2
                  ),
                ]}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#0070f3"
                strokeWidth={2}
                fill="url(#weightFill)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="goal"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
            <span>Current: {currentWeight} lbs</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
            <span>Goal: {goalWeight} lbs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
