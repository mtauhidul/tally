// app/dashboard/page.tsx
"use client";

import { CalendarDaysIcon, Plus, TrendingUp, Utensils } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AddMealDialog } from "@/components/add-meal-dialog";
import { CalorieCalendar } from "@/components/calorie-calendar";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightChart } from "@/components/weight-chart";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("today");

  // Sample data - in a real app, this would come from the API
  const dailyStats = {
    calories: {
      consumed: 1240,
      target: 2000,
      percentage: 62,
    },
    protein: {
      consumed: 68,
      target: 120,
      percentage: 56,
    },
    carbs: {
      consumed: 142,
      target: 250,
      percentage: 57,
    },
    fat: {
      consumed: 42,
      target: 65,
      percentage: 64,
    },
  };

  const meals = [
    {
      name: "Breakfast",
      items: 2,
      calories: 460,
      logged: true,
    },
    {
      name: "Lunch",
      items: 1,
      calories: 780,
      logged: true,
    },
    {
      name: "Dinner",
      items: 0,
      calories: 0,
      logged: false,
    },
    {
      name: "Snacks",
      items: 0,
      calories: 0,
      logged: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <AddMealDialog
          onMealAdded={(meal) => {
            // In a real app, this would update the state or trigger a refetch
            console.log("Meal added:", meal);
          }}
        />
      </div>

      {/* Daily Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Calories
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.calories.consumed} / {dailyStats.calories.target}
            </div>
            <Progress
              value={dailyStats.calories.percentage}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Average
            </CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,845</div>
            <p className="text-xs text-muted-foreground mt-1">
              -156 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.protein.consumed}g / {dailyStats.protein.target}g
            </div>
            <Progress
              value={dailyStats.protein.percentage}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Today vs Stats */}
      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="stats">Stats & Progress</TabsTrigger>
        </TabsList>

        {/* Today's Tab Content */}
        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            {/* Chat Interface */}
            <div className="md:col-span-4">
              <ChatInterface />
            </div>

            {/* Today's Meals */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Today&apos;s Meals</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="space-y-4">
                  {meals.map((meal) => (
                    <div
                      key={meal.name}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="ml-2 flex-1">
                        <h3 className="text-sm font-medium">{meal.name}</h3>
                        {meal.logged ? (
                          <p className="text-xs text-muted-foreground mt-1">
                            {meal.items} item{meal.items !== 1 ? "s" : ""} ·{" "}
                            {meal.calories} calories
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1">
                            No items yet
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add {meal.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Carbs</div>
                    <div className="text-gray-500">
                      {dailyStats.carbs.consumed}g / {dailyStats.carbs.target}g
                    </div>
                  </div>
                  <Progress
                    value={dailyStats.carbs.percentage}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Protein</div>
                    <div className="text-gray-500">
                      {dailyStats.protein.consumed}g /{" "}
                      {dailyStats.protein.target}g
                    </div>
                  </div>
                  <Progress
                    value={dailyStats.protein.percentage}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Fat</div>
                    <div className="text-gray-500">
                      {dailyStats.fat.consumed}g / {dailyStats.fat.target}g
                    </div>
                  </div>
                  <Progress value={dailyStats.fat.percentage} className="h-2" />
                </div>
                <div className="pt-4">
                  <Link
                    href="/dashboard/history"
                    className="text-sm font-medium text-black hover:underline"
                  >
                    View detailed nutrition →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab Content */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <WeightChart />
            <CalorieCalendar />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Weight Loss</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Starting: 180 lbs
                    </span>
                    <span className="text-sm font-medium">
                      Current: 177.4 lbs
                    </span>
                    <span className="text-sm text-gray-500">Goal: 165 lbs</span>
                  </div>
                  <Progress value={17.3} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    17% of goal achieved (2.6 lbs lost)
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Calorie Adherence
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last 7 days</span>
                    <span className="text-sm font-medium">85% on target</span>
                  </div>
                  <Progress value={85} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    5 out of 7 days within calorie target
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Projected Goal Achievement
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                      At your current rate, you will reach your goal weight of{" "}
                      <span className="font-medium">165 lbs</span> by{" "}
                      <span className="font-medium">May 15, 2025</span>.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/dashboard/settings"
                    className="text-sm font-medium text-black hover:underline"
                  >
                    Update your goals →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
