import { Calendar, Plus, TrendingUp, Utensils } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Meal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Calories
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240 / 2,000</div>
            <Progress value={62} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Average
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold">68g / 120g</div>
            <Progress value={56} className="h-2 mt-2" />
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Today&apos;s Meals</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => (
                <div
                  key={meal}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="ml-2 flex-1">
                    <h3 className="text-sm font-medium">{meal}</h3>
                    {meal === "Breakfast" ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        2 items · 460 calories
                      </p>
                    ) : meal === "Lunch" ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        1 item · 780 calories
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        No items yet
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add {meal}</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Nutrition Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Carbs</div>
                  <div className="text-gray-500">142g / 250g</div>
                </div>
                <Progress value={57} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Protein</div>
                  <div className="text-gray-500">68g / 120g</div>
                </div>
                <Progress value={56} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Fat</div>
                  <div className="text-gray-500">42g / 65g</div>
                </div>
                <Progress value={64} className="h-2" />
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
      </div>
    </div>
  );
}
