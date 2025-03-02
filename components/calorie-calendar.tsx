// components/calorie-calendar.tsx
"use client";

import { addDays, format, startOfMonth, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayData {
  date: Date;
  calories: number;
  target: number;
  percentage: number;
}

// Generate sample data for the calendar view
const generateCalendarData = () => {
  const today = new Date();
  const data: DayData[] = [];

  // Get first day to display (first day of current month's first week)
  const firstDayOfMonth = startOfMonth(today);
  const firstDayToShow = startOfWeek(firstDayOfMonth);

  // Generate 35 days (5 weeks) of data
  const dailyTarget = 2000;

  for (let i = 0; i < 35; i++) {
    const currentDate = addDays(firstDayToShow, i);

    // For demo purposes, generate random calorie values
    // For past days, more likely to be close to target
    // For future days, return zero

    let calories = 0;

    // Only generate data for past days
    if (currentDate <= today) {
      // Generate a number between 1500-2500, with higher probability of being close to target
      const variance = Math.random() * 1000 - 500; // -500 to +500
      calories = Math.max(0, Math.round(dailyTarget + variance));
    }

    data.push({
      date: currentDate,
      calories,
      target: dailyTarget,
      percentage: calories > 0 ? (calories / dailyTarget) * 100 : 0,
    });
  }

  return data;
};

export function CalorieCalendar() {
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [perfectDays, setPerfectDays] = useState<number>(0);

  useEffect(() => {
    // In a real app, we would fetch this data from the backend
    const data = generateCalendarData();
    setCalendarData(data);

    // Set current month label
    if (data.length > 10) {
      setCurrentMonth(format(data[10].date, "MMMM yyyy"));
    }

    // Count "perfect days" (days within 10% of target)
    const perfect = data.filter((day) => {
      const percentOfTarget = (day.calories / day.target) * 100;
      return (
        day.calories > 0 && percentOfTarget >= 90 && percentOfTarget <= 110
      );
    }).length;

    setPerfectDays(perfect);
  }, []);

  // Get color based on percentage of target calories
  const getColorClass = (day: DayData): string => {
    if (day.calories === 0) return "bg-gray-100"; // No data

    const percentOfTarget = (day.calories / day.target) * 100;

    if (percentOfTarget < 80) return "bg-blue-200"; // Under target (good)
    if (percentOfTarget <= 100) return "bg-green-300"; // At target (perfect)
    if (percentOfTarget <= 120) return "bg-yellow-200"; // Slightly over
    return "bg-red-200"; // Far over target
  };

  // Group days into weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  // Day labels for header (Sun, Mon, etc.)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Calorie Calendar
        </CardTitle>
        <CardDescription>{perfectDays} perfect days this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center font-medium mb-2">{currentMonth}</div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {dayLabels.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const key = `${weekIndex}-${dayIndex}`;
              const isToday =
                format(day.date, "yyyy-MM-dd") ===
                format(new Date(), "yyyy-MM-dd");
              const isFutureDay = day.date > new Date();

              return (
                <TooltipProvider key={key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium
                          ${isToday ? "ring-2 ring-black" : ""}
                          ${
                            isFutureDay
                              ? "bg-gray-50 text-gray-300"
                              : getColorClass(day)
                          }
                        `}
                      >
                        {format(day.date, "d")}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs p-2">
                      <p>{format(day.date, "EEEE, MMMM d")}</p>
                      {day.calories > 0 ? (
                        <>
                          <p className="font-medium mt-1">
                            {day.calories} / {day.target} calories
                          </p>
                          <p className="text-gray-500">
                            {day.calories < day.target
                              ? `${Math.abs(
                                  day.target - day.calories
                                )} under target`
                              : day.calories > day.target
                              ? `${day.calories - day.target} over target`
                              : "Exactly on target!"}
                          </p>
                        </>
                      ) : isFutureDay ? (
                        <p className="text-gray-500">Future day</p>
                      ) : (
                        <p className="text-gray-500">No data recorded</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-md bg-blue-200 mr-1"></div>
            <span>Under target</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-md bg-green-300 mr-1"></div>
            <span>Perfect day</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-md bg-yellow-200 mr-1"></div>
            <span>Slightly over</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-md bg-red-200 mr-1"></div>
            <span>Far over target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
