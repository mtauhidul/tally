"use client";

import { AddMealDialog } from "@/components/add-meal-dialog";
import { AIAssistant } from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UnifiedChart } from "@/components/unified-chart";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  // Sample data for remaining features
  const dailyStats = {
    caloriesConsumed: 386,
    caloriesTarget: 1800,
    remaining: 1414,
    percentage: 21.4, // (386/1800)*100
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
      items: 0,
      calories: 0,
      logged: false,
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

  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-4 pb-6">
      {/* Calorie Progress Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-bold text-green-500">
              {dailyStats.caloriesConsumed}
            </span>
            <span className="text-2xl font-bold">{dailyStats.remaining}</span>
          </div>
          <Progress value={dailyStats.percentage} className="h-6 bg-gray-100" />
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>calories today</span>
            <span>calories remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Interface */}
      <AIAssistant />

      {/* Today's Meals */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3">
          <h2 className="font-semibold text-lg mb-2">Today&apos;s Meals</h2>
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.name}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{meal.name}</h3>
                  {meal.logged ? (
                    <p className="text-xs text-gray-500">
                      {meal.items} item{meal.items !== 1 ? "s" : ""} -{" "}
                      {meal.calories} calories
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">No items logged yet</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsAddMealDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Progress Chart */}
      <UnifiedChart />

      {/* Add Meal Dialog */}
      <AddMealDialog
        open={isAddMealDialogOpen}
        onOpenChange={setIsAddMealDialogOpen}
        onMealAdded={(meal) => {
          console.log("Meal added:", meal);
          setIsAddMealDialogOpen(false);
        }}
      />
    </div>
  );
}
