// components/enhanced-unified-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  Bar,
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

export function UnifiedChart() {
  interface ChartData {
    date: string;
    weight: number;
    goalTrajectory: number;
    goalLine: number;
    calorieTarget: number;
    goodCalories: number;
    badCalories: number;
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }

  const [data, setData] = useState<ChartData[]>([]);
  const [view, setView] = useState<
    "combined" | "weight" | "calories" | "macros"
  >("combined");
  const [timeFrame, setTimeFrame] = useState<
    "1week" | "2weeks" | "1month" | "3months"
  >("2weeks");

  useEffect(() => {
    const generateChartData = () => {
      const newData = [];
      const startDate = new Date(2025, 0, 15);
      const endDate = new Date(2025, 1, 14);
      const startWeight = 212;
      const goalWeight = 195;
      const targetDate = new Date(2025, 3, 15);

      const totalDays = Math.round(
        (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weightLossPerDay = (startWeight - goalWeight) / totalDays;

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const daysSinceStart = Math.round(
          (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const expectedWeight = startWeight - weightLossPerDay * daysSinceStart;
        const randomVariation = 0; // Remove random variation to prevent hydration mismatch
        const actualWeight = expectedWeight + randomVariation;

        const calorieTarget = 1800;
        const goodCalories = Math.floor(1000 + daysSinceStart * 10);
        const badCalories =
          Math.random() > 0.7 ? Math.floor(Math.random() * 600) : 0;

        const protein = Math.floor((goodCalories * 0.3) / 4);
        const carbs = Math.floor((goodCalories * 0.5) / 4);
        const fat = Math.floor((goodCalories * 0.2) / 9);

        newData.push({
          date: new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(d),
          weight: parseFloat(actualWeight.toFixed(1)),
          goalTrajectory: parseFloat(expectedWeight.toFixed(1)),
          goalLine: 195,
          calorieTarget,
          goodCalories,
          badCalories,
          totalCalories: goodCalories + badCalories,
          protein,
          carbs,
          fat,
          totalProtein: protein,
          totalCarbs: carbs,
          totalFat: fat,
        });
      }
      return newData;
    };

    setData(generateChartData());
  }, []);

  const currentWeight = data[data.length - 1]?.weight || 0;
  const goalWeight = 195;
  const startWeight = data[0]?.weight || 0;
  const totalLoss = startWeight - goalWeight;
  const currentLoss = startWeight - currentWeight;
  const progressPercent = Math.round((currentLoss / totalLoss) * 100);
  const recentCalories =
    data.slice(-7).reduce((sum, day) => sum + day.totalCalories, 0) / 7;

  const filteredData = data; // Define filteredData based on data

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-3">
        <CardTitle className="text-lg font-semibold">Progress</CardTitle>
        <Select
          value={timeFrame}
          onValueChange={(value: "1week" | "2weeks" | "1month" | "3months") =>
            setTimeFrame(value)
          }
        >
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1week">Last 7 Days</SelectItem>
            <SelectItem value="2weeks">Last 14 Days</SelectItem>
            <SelectItem value="1month">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div className="bg-gray-50 rounded-md p-2">
            <p className="text-gray-500">Current Weight</p>
            <p className="text-xl font-bold">{currentWeight} lbs</p>
            <p className="text-gray-500 text-xs">{progressPercent}% to goal</p>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <p className="text-gray-500">Avg. Daily Calories</p>
            <p className="text-xl font-bold">{Math.round(recentCalories)}</p>
            <p className="text-gray-500 text-xs">Goal: 1,800</p>
          </div>
        </div>

        <Tabs
          defaultValue="combined"
          className="w-full"
          value={view}
          onValueChange={(value) =>
            setView(value as "combined" | "weight" | "calories" | "macros")
          }
        >
          <TabsList className="w-full mb-3 h-8">
            <TabsTrigger value="combined" className="text-xs">
              Combined
            </TabsTrigger>
            <TabsTrigger value="weight" className="text-xs">
              Weight
            </TabsTrigger>
            <TabsTrigger value="calories" className="text-xs">
              Calories
            </TabsTrigger>
            <TabsTrigger value="macros" className="text-xs">
              Macros
            </TabsTrigger>
          </TabsList>

          <div className="h-[220px] w-full">
            <TabsContent value="combined" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}`}
                    stroke="#2563eb" // blue
                    width={30}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 2000]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}`}
                    stroke="#22c55e" // green
                    width={30}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "weight" || name === "goalTrajectory")
                        return [
                          `${value} lbs`,
                          name === "weight" ? "Weight" : "Goal Trajectory",
                        ];
                      if (name === "goodCalories")
                        return [`${value} cal`, "Good Calories"];
                      if (name === "badCalories")
                        return [`${value} cal`, "Excess Calories"];
                      return [`${value}`, name];
                    }}
                    labelFormatter={(label) => `${label}`}
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
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="weight" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}`}
                    width={30}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} lbs`,
                      name === "weight"
                        ? "Weight"
                        : name === "goalTrajectory"
                        ? "Goal Trajectory"
                        : name,
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
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
                      value: "Goal",
                      position: "insideTopRight",
                      fontSize: 10,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="calories" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
                  />
                  <YAxis
                    domain={[0, 2500]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}`}
                    width={30}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "goodCalories")
                        return [`${value} cal`, "Good Calories"];
                      if (name === "badCalories")
                        return [`${value} cal`, "Excess Calories"];
                      if (name === "totalCalories")
                        return [`${value} cal`, "Total Calories"];
                      return [`${value}`, name];
                    }}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px" }}
                  />
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
                    name="Excess Calories"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalCalories"
                    stroke="#000000"
                    dot={false}
                    name="Total Calories"
                  />
                  <ReferenceLine
                    y={1800}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{
                      value: "Target",
                      position: "insideBottomRight",
                      fontSize: 10,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="macros" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[0, "auto"]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}g`}
                    width={30}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 2000]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value} cal`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "protein") return [`${value}g`, "Protein"];
                      if (name === "carbs") return [`${value}g`, "Carbs"];
                      if (name === "fat") return [`${value}g`, "Fat"];
                      if (name === "totalCalories")
                        return [`${value} cal`, "Total Calories"];
                      return [`${value}`, name];
                    }}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="protein"
                    fill="#3b82f6"
                    name="Protein"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="carbs"
                    fill="#22c55e"
                    name="Carbs"
                  />
                  <Bar yAxisId="left" dataKey="fat" fill="#f59e0b" name="Fat" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalCalories"
                    stroke="#000000"
                    dot={false}
                    name="Total Calories"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
              <span>Weight</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span>Good Calories</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
              <span>Excess</span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
