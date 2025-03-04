/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Define interfaces for our data
interface WeightDataPoint {
  date: string;
  weight: number;
}

interface CalorieDataPoint {
  date: string;
  calories: number;
}

interface UnifiedChartProps {
  weightData: WeightDataPoint[];
  calorieData: CalorieDataPoint[];
  startWeight: number;
  goalWeight: number;
  currentWeight: number;
  calorieTarget: number;
}

export function UnifiedChart({
  weightData,
  calorieData,
  startWeight,
  goalWeight,
  currentWeight,
  calorieTarget,
}: UnifiedChartProps) {
  // State for chart time range
  const [timeRange, setTimeRange] = useState<
    "7days" | "15days" | "30days" | "custom"
  >("15days");

  // Mock data for development - remove in production
  const mockWeightData: WeightDataPoint[] =
    weightData.length > 0
      ? weightData
      : [
          { date: "3/1", weight: 205 },
          { date: "3/2", weight: 204.5 },
          { date: "3/3", weight: 204.8 },
          { date: "3/4", weight: 204.3 },
          { date: "3/5", weight: 203.7 },
          { date: "3/6", weight: 203.2 },
          { date: "3/7", weight: 203.5 },
          { date: "3/8", weight: 202.8 },
          { date: "3/9", weight: 202.4 },
          { date: "3/10", weight: 202.1 },
          { date: "3/11", weight: 201.8 },
          { date: "3/12", weight: 201.5 },
          { date: "3/13", weight: 201.3 },
          { date: "3/14", weight: 201.0 },
          { date: "3/15", weight: 200.6 },
        ];

  const mockCalorieData: CalorieDataPoint[] =
    calorieData.length > 0
      ? calorieData
      : [
          { date: "3/1", calories: 1750 },
          { date: "3/2", calories: 1820 },
          { date: "3/3", calories: 1650 },
          { date: "3/4", calories: 1900 },
          { date: "3/5", calories: 1720 },
          { date: "3/6", calories: 1800 },
          { date: "3/7", calories: 1920 },
          { date: "3/8", calories: 1650 },
          { date: "3/9", calories: 1750 },
          { date: "3/10", calories: 1630 },
          { date: "3/11", calories: 1850 },
          { date: "3/12", calories: 1780 },
          { date: "3/13", calories: 1700 },
          { date: "3/14", calories: 1650 },
          { date: "3/15", calories: 1550 },
        ];

  // Set default values if not provided
  const actualWeightData = weightData.length > 0 ? weightData : mockWeightData;
  const actualCalorieData =
    calorieData.length > 0 ? calorieData : mockCalorieData;
  const actualStartWeight = startWeight || 205;
  const actualGoalWeight = goalWeight || 195;
  const actualCurrentWeight = currentWeight || 200.6;
  const actualCalorieTarget = calorieTarget || 1800;

  // Filter data based on selected time range
  const getFilteredData = (data: any[]) => {
    switch (timeRange) {
      case "7days":
        return data.slice(-7);
      case "15days":
        return data.slice(-15);
      case "30days":
        return data.slice(-30);
      default:
        return data.slice(-15); // Default to 15 days
    }
  };

  // Format calorie data to include color coding
  const formattedCalorieData = getFilteredData(actualCalorieData).map(
    (item) => ({
      ...item,
      goodCalories:
        item.calories <= actualCalorieTarget
          ? item.calories
          : actualCalorieTarget,
      badCalories:
        item.calories > actualCalorieTarget
          ? item.calories - actualCalorieTarget
          : 0,
    })
  );

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredData(actualWeightData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[
                    Math.min(
                      actualGoalWeight,
                      Math.min(...actualWeightData.map((d) => d.weight))
                    ) - 3,
                    Math.max(
                      actualStartWeight,
                      Math.max(...actualWeightData.map((d) => d.weight))
                    ) + 3,
                  ]}
                />
                <Tooltip />
                <ReferenceLine
                  y={actualStartWeight}
                  stroke="red"
                  strokeDasharray="3 3"
                  label="Start"
                />
                <ReferenceLine
                  y={actualGoalWeight}
                  stroke="green"
                  strokeDasharray="3 3"
                  label="Goal"
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <div>
              <span className="font-semibold">Start:</span> {actualStartWeight}{" "}
              lbs
            </div>
            <div>
              <span className="font-semibold">Current:</span>{" "}
              {actualCurrentWeight} lbs
            </div>
            <div>
              <span className="font-semibold">Goal:</span> {actualGoalWeight}{" "}
              lbs
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Daily Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedCalorieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <ReferenceLine
                  y={actualCalorieTarget}
                  stroke="black"
                  strokeDasharray="3 3"
                  label="Target"
                />
                <Bar
                  dataKey="goodCalories"
                  stackId="a"
                  fill="#22c55e"
                  name="Under Target"
                />
                <Bar
                  dataKey="badCalories"
                  stackId="a"
                  fill="#ef4444"
                  name="Over Target"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <div>
              <span className="font-semibold">Target:</span>{" "}
              {actualCalorieTarget} kcal
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setTimeRange("7days")}
                className={`px-2 py-1 rounded ${
                  timeRange === "7days" ? "bg-black text-white" : "bg-gray-100"
                }`}
              >
                7d
              </button>
              <button
                onClick={() => setTimeRange("15days")}
                className={`px-2 py-1 rounded ${
                  timeRange === "15days" ? "bg-black text-white" : "bg-gray-100"
                }`}
              >
                15d
              </button>
              <button
                onClick={() => setTimeRange("30days")}
                className={`px-2 py-1 rounded ${
                  timeRange === "30days" ? "bg-black text-white" : "bg-gray-100"
                }`}
              >
                30d
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
