import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeightDataPoint {
  date: string;
  weight: number;
}

interface CalorieDataPoint {
  date: string;
  consumed: number;
  remaining: number;
  target: number;
}

interface WeightDataWithGoal extends WeightDataPoint {
  goalWeight?: number;
}

interface UnifiedChartProps {
  weightData: WeightDataPoint[];
  calorieData: CalorieDataPoint[];
  startWeight: number;
  goalWeight: number;
  goalDate: string;
  calorieTarget: number;
}

// Only use a named export, not a default export
export const UnifiedChart: React.FC<UnifiedChartProps> = ({
  weightData = [], // Provide default empty arrays to prevent undefined errors
  calorieData = [],
  startWeight,
  goalWeight,
  goalDate,
  calorieTarget,
}) => {
  const [timeRange, setTimeRange] = useState<string>("15d");

  // Filter data based on selected time range
  const getFilteredData = <T extends { date: string }>(
    data: T[] = [],
    daysBack: number
  ): T[] => {
    // Guard against undefined or null data
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - daysBack);

    return data.filter((item) => {
      if (!item || !item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  };

  const getFilteredWeightData = (): WeightDataPoint[] => {
    // Ensure weightData is not undefined
    if (!weightData || !Array.isArray(weightData)) {
      return [];
    }

    switch (timeRange) {
      case "7d":
        return getFilteredData(weightData, 7);
      case "30d":
        return getFilteredData(weightData, 30);
      case "all":
        return [...weightData]; // Return a copy to avoid mutation issues
      case "15d":
      default:
        return getFilteredData(weightData, 15);
    }
  };

  const getFilteredCalorieData = (): CalorieDataPoint[] => {
    // Ensure calorieData is not undefined
    if (!calorieData || !Array.isArray(calorieData)) {
      return [];
    }

    switch (timeRange) {
      case "7d":
        return getFilteredData(calorieData, 7);
      case "30d":
        return getFilteredData(calorieData, 30);
      case "all":
        return [...calorieData]; // Return a copy to avoid mutation issues
      case "15d":
      default:
        return getFilteredData(calorieData, 15);
    }
  };

  const filteredWeightData = getFilteredWeightData();
  const filteredCalorieData = getFilteredCalorieData();

  // Calculate the goal weight line
  const calculateGoalWeightLine = (): WeightDataWithGoal[] => {
    if (!filteredWeightData || filteredWeightData.length === 0) return [];

    const startDate = new Date(filteredWeightData[0].date);
    const endDate = new Date(goalDate || new Date().toISOString()); // Fallback to today if goalDate is not provided
    const daysDifference = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    if (daysDifference <= 0) return [...filteredWeightData]; // Return a copy of original data

    const weightDifference = goalWeight - startWeight;
    const dailyChange = weightDifference / daysDifference;

    return filteredWeightData.map((point) => {
      const currentDate = new Date(point.date);
      const daysPassed = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      return {
        ...point,
        goalWeight: startWeight + dailyChange * daysPassed,
      };
    });
  };

  const weightDataWithGoal = calculateGoalWeightLine();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Progress Tracking</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="15d">15 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Track your weight and calorie progress over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="calories">Calories</TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightDataWithGoal}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine
                    y={startWeight}
                    stroke="red"
                    strokeDasharray="3 3"
                    label={{ value: "Start", position: "insideTopRight" }}
                  />
                  <ReferenceLine
                    y={goalWeight}
                    stroke="green"
                    strokeDasharray="3 3"
                    label={{ value: "Goal", position: "insideBottomRight" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    name="Actual Weight"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="goalWeight"
                    stroke="#9ca3af"
                    name="Target Trajectory"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="calories" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredCalorieData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine
                    y={calorieTarget}
                    stroke="#9ca3af"
                    strokeDasharray="3 3"
                    label={{ value: "Daily Target", position: "right" }}
                  />
                  <Bar dataKey="consumed" name="Consumed" barSize={20}>
                    {filteredCalorieData.map((entry, index) => (
                      <Cell
                        key={`consumed-cell-${index}`}
                        fill={
                          entry.consumed <= calorieTarget
                            ? "#22c55e"
                            : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="remaining"
                    name="Remaining"
                    fill="#3b82f6"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
