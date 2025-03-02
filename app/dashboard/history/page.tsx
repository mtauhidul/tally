"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
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

// Sample data
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

export default function HistoryPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [mealType, setMealType] = useState<string>("all");

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

  // Calculate totals
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Meal History</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
    </div>
  );
}
