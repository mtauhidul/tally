// app/dashboard/history/page.tsx
"use client";

import { format, subDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data for meals
const MEALS_DATA = [
  {
    id: 1,
    date: new Date(2025, 2, 1),
    meal: "Breakfast",
    food: "Oatmeal with banana",
    calories: 320,
    protein: 12,
    carbs: 52,
    fat: 6,
  },
  {
    id: 2,
    date: new Date(2025, 2, 1),
    meal: "Lunch",
    food: "Chicken salad sandwich",
    calories: 480,
    protein: 28,
    carbs: 45,
    fat: 18,
  },
  {
    id: 3,
    date: new Date(2025, 2, 1),
    meal: "Dinner",
    food: "Salmon with vegetables",
    calories: 520,
    protein: 38,
    carbs: 30,
    fat: 26,
  },
  {
    id: 4,
    date: new Date(2025, 2, 2),
    meal: "Breakfast",
    food: "Greek yogurt with berries",
    calories: 250,
    protein: 18,
    carbs: 32,
    fat: 4,
  },
  {
    id: 5,
    date: new Date(2025, 2, 2),
    meal: "Lunch",
    food: "Turkey wrap",
    calories: 420,
    protein: 25,
    carbs: 48,
    fat: 14,
  },
];

// Generate chart data
const generateChartData = () => {
  const now = new Date();
  const data = [];

  // Generate 14 days of data
  for (let i = 13; i >= 0; i--) {
    const date = subDays(now, i);
    // Create some sample data with random fluctuations
    // In a real app, this would come from API
    const calorieTarget = 2000;
    const variance = Math.random() * 600 - 300; // Random value between -300 and 300

    data.push({
      date: format(date, "MMM dd"),
      calories: Math.max(0, Math.round(calorieTarget + variance)),
      target: calorieTarget,
      carbs: Math.round(Math.max(0, ((calorieTarget + variance) * 0.5) / 4)), // Rough estimate: 50% of calories from carbs, 4 cal/g
      protein: Math.round(Math.max(0, ((calorieTarget + variance) * 0.25) / 4)), // 25% from protein, 4 cal/g
      fat: Math.round(Math.max(0, ((calorieTarget + variance) * 0.25) / 9)), // 25% from fat, 9 cal/g
    });
  }

  return data;
};

// Generate weight data
const generateWeightData = () => {
  const now = new Date();
  const data = [];

  // Starting weight and goal
  const startWeight = 180;
  const goalWeight = 165;

  // Generate 30 days of data with a slight downward trend
  for (let i = 29; i >= 0; i--) {
    const date = subDays(now, i);

    // Create a gradual downward trend with some random fluctuation
    const daysFromStart = 30 - i;
    const expectedProgress = daysFromStart / 90; // Assume 90 days to reach goal
    const expectedLoss = (startWeight - goalWeight) * expectedProgress;
    const currentExpectedWeight = startWeight - expectedLoss;

    // Add random daily fluctuation
    const fluctuation = Math.random() * 1.4 - 0.7; // Between -0.7 and +0.7 lbs

    data.push({
      date: format(date, "MMM dd"),
      weight: parseFloat((currentExpectedWeight + fluctuation).toFixed(1)),
    });
  }

  return data;
};

export default function HistoryPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [mealType, setMealType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("meals");
  const [timeRange, setTimeRange] = useState<string>("2weeks");

  // Generate chart data
  const calorieData = generateChartData();
  const weightData = generateWeightData();

  // Filter meals based on selected date
  const filteredMeals = MEALS_DATA.filter((meal) => {
    const isSameDate =
      meal.date.getDate() === date.getDate() &&
      meal.date.getMonth() === date.getMonth() &&
      meal.date.getFullYear() === date.getFullYear();

    if (mealType === "all") {
      return isSameDate;
    }

    return isSameDate && meal.meal.toLowerCase() === mealType.toLowerCase();
  });

  // Calculate totals for the filtered meals
  const totalCalories = filteredMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );
  const totalProtein = filteredMeals.reduce(
    (sum, meal) => sum + meal.protein,
    0
  );
  const totalCarbs = filteredMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = filteredMeals.reduce((sum, meal) => sum + meal.fat, 0);

  // Navigate to previous day
  const prevDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    setDate(prev);
  };

  // Navigate to next day
  const nextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    setDate(next);
  };

  // Handle time range selection for charts
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // In a real app, this would trigger a data refetch with the new range
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          History & Analysis
        </h1>
        <Button variant="outline" className="hidden sm:flex">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="meals" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="meals">Daily Meals</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        {/* Meals Tab Content */}
        <TabsContent value="meals" className="space-y-4">
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle>Daily Log</CardTitle>
              <CardDescription>View your meal history by date</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={prevDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, "MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date: Date | undefined) =>
                          date && setDate(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="icon" onClick={nextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Meals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredMeals.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meal</TableHead>
                        <TableHead>Food</TableHead>
                        <TableHead className="text-right">Calories</TableHead>
                        <TableHead className="text-right">Protein</TableHead>
                        <TableHead className="text-right">Carbs</TableHead>
                        <TableHead className="text-right">Fat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMeals.map((meal) => (
                        <TableRow key={meal.id}>
                          <TableCell className="font-medium">
                            {meal.meal}
                          </TableCell>
                          <TableCell>{meal.food}</TableCell>
                          <TableCell className="text-right">
                            {meal.calories}
                          </TableCell>
                          <TableCell className="text-right">
                            {meal.protein}g
                          </TableCell>
                          <TableCell className="text-right">
                            {meal.carbs}g
                          </TableCell>
                          <TableCell className="text-right">
                            {meal.fat}g
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Daily Total</span>
                      <div className="flex space-x-4">
                        <span>{totalCalories} cal</span>
                        <span>{totalProtein}g protein</span>
                        <span>{totalCarbs}g carbs</span>
                        <span>{totalFat}g fat</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No meals logged for this date.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calories Tab Content */}
        <TabsContent value="calories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Calorie Trends</CardTitle>
                <CardDescription>
                  Compare your daily intake to targets
                </CardDescription>
              </div>
              <Select
                defaultValue={timeRange}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1 Week</SelectItem>
                  <SelectItem value="2weeks">2 Weeks</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={calorieData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCalories"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, "dataMax + 200"]}
                    />
                    <Tooltip formatter={(value) => `${value} calories`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="calories"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCalories)"
                      name="Daily Calories"
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#10b981"
                      fill="none"
                      strokeDasharray="5 5"
                      name="Calorie Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 mb-4">
                <h3 className="text-lg font-medium mb-4">
                  Macronutrient Distribution
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={calorieData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                      <Tooltip formatter={(value) => `${value}g`} />
                      <Legend />
                      <Bar
                        dataKey="carbs"
                        stackId="macros"
                        fill="#3b82f6"
                        name="Carbs (g)"
                      />
                      <Bar
                        dataKey="protein"
                        stackId="macros"
                        fill="#10b981"
                        name="Protein (g)"
                      />
                      <Bar
                        dataKey="fat"
                        stackId="macros"
                        fill="#f59e0b"
                        name="Fat (g)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weight Tab Content */}
        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Weight Tracking</CardTitle>
                <CardDescription>
                  Monitor your progress over time
                </CardDescription>
              </div>
              <Select
                defaultValue={timeRange}
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1 Week</SelectItem>
                  <SelectItem value="2weeks">2 Weeks</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weightData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorWeight"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      domain={["dataMin - 5", "dataMax + 5"]}
                    />
                    <Tooltip formatter={(value) => `${value} lbs`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                      name="Weight (lbs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Starting Weight
                  </h4>
                  <p className="text-2xl font-bold">180.0 lbs</p>
                  <p className="text-xs text-gray-500 mt-1">Feb 1, 2025</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Current Weight
                  </h4>
                  <p className="text-2xl font-bold">177.4 lbs</p>
                  <p className="text-xs text-gray-500 mt-1">Today</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Goal Weight
                  </h4>
                  <p className="text-2xl font-bold">165.0 lbs</p>
                  <p className="text-xs text-gray-500 mt-1">May 15, 2025</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Recent Weigh-ins</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Weight</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weightData.slice(-7).map((entry, index) => {
                      const prevWeight =
                        index > 0
                          ? weightData[weightData.length - index - 1].weight
                          : entry.weight;
                      const change = entry.weight - prevWeight;

                      return (
                        <TableRow key={entry.date}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell className="text-right font-medium">
                            {entry.weight} lbs
                          </TableCell>
                          <TableCell className="text-right">
                            {index === 0 ? (
                              "-"
                            ) : (
                              <span
                                className={
                                  change < 0
                                    ? "text-green-600"
                                    : change > 0
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }
                              >
                                {change.toFixed(1)} lbs
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
