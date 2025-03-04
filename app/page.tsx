/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, HomeIcon, Settings, User } from "lucide-react";
import { useState } from "react";

import HomeDashboard from "@/components/home-dashboard";
import OnboardingFlow from "@/components/onboarding-flow";
import SettingsPage from "@/components/settings-page";
import { UnifiedChart } from "@/components/unified-chart";

// Mock data for demonstration
const mockUser = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "555-123-4567",
  dailyCalorieBudget: 1800,
  caloriesConsumed: 950,
  currentWeight: 204.5,
  previousWeight: 205,
  notifications: {
    dailyReminders: true,
    weeklyProgress: true,
    achievements: true,
  },
  goalWeight: 195,
  goalDate: "2025-04-15",
  unitPreference: "imperial" as "imperial" | "metric",
  isOnboarded: false, // Set to false to show onboarding
};

const mockWeightData = [
  { date: "2025-02-25", weight: 205.0 },
  { date: "2025-02-26", weight: 204.8 },
  { date: "2025-02-27", weight: 205.2 },
  { date: "2025-02-28", weight: 204.9 },
  { date: "2025-03-01", weight: 204.7 },
  { date: "2025-03-02", weight: 204.5 },
  { date: "2025-03-03", weight: 204.3 },
];

const mockCalorieData = [
  { date: "2025-02-25", consumed: 1750, remaining: 50, target: 1800 },
  { date: "2025-02-26", consumed: 1830, remaining: 0, target: 1800 },
  { date: "2025-02-27", consumed: 1690, remaining: 110, target: 1800 },
  { date: "2025-02-28", consumed: 1920, remaining: 0, target: 1800 },
  { date: "2025-03-01", consumed: 1600, remaining: 200, target: 1800 },
  { date: "2025-03-02", consumed: 1750, remaining: 50, target: 1800 },
  { date: "2025-03-03", consumed: 950, remaining: 850, target: 1800 },
];

export default function Home() {
  const [user, setUser] = useState(mockUser);
  const [weightData, setWeightData] = useState(mockWeightData);
  const [calorieData] = useState(mockCalorieData);
  const [activeTab, setActiveTab] = useState("home");

  // Handlers for user actions
  const handleLogMeal = (message: string) => {
    console.log("Logging meal:", message);
    // In a real app, this would call an API to process the meal
  };

  const handleLogWeight = (weight: number) => {
    console.log("Logging weight:", weight);
    // Update user weight
    setUser((prev) => ({
      ...prev,
      previousWeight: prev.currentWeight,
      currentWeight: weight,
    }));

    // Add to weight history
    const today = new Date().toISOString().split("T")[0];
    setWeightData((prev) => [...prev, { date: today, weight }]);
  };

  const handleAskQuestion = (question: string) => {
    console.log("Question asked:", question);
    // In a real app, this would send the question to an LLM
  };

  const handleSaveSettings = (newSettings: typeof user) => {
    console.log("Saving settings:", newSettings);
    setUser(newSettings);
  };

  const handleCompleteOnboarding = (userData: any) => {
    console.log("Onboarding completed:", userData);
    setUser((prev) => ({
      ...prev,
      ...userData,
      isOnboarded: true,
    }));
  };

  // If user is not onboarded, show onboarding flow
  if (!user.isOnboarded) {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">niblet.ai</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{user.name}</span>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="mt-0 space-y-8">
            <HomeDashboard
              user={user}
              onLogMeal={handleLogMeal}
              onLogWeight={handleLogWeight}
              onAskQuestion={handleAskQuestion}
            />
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <UnifiedChart
              weightData={weightData}
              calorieData={calorieData}
              startWeight={205}
              goalWeight={user.goalWeight}
              goalDate={user.goalDate}
              calorieTarget={user.dailyCalorieBudget}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsPage settings={user} onSaveSettings={handleSaveSettings} />
          </TabsContent>

          {/* Bottom Tabs Navigation */}
          <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
            <TabsList className="w-full rounded-none h-16">
              <TabsTrigger value="home" className="flex-1 py-6">
                <div className="flex flex-col items-center">
                  <HomeIcon className="w-5 h-5" />
                  <span className="text-xs mt-1">Home</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex-1 py-6">
                <div className="flex flex-col items-center">
                  <BarChart2 className="h-5 w-5" />
                  <span className="text-xs mt-1">Charts</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 py-6">
                <div className="flex flex-col items-center">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs mt-1">Settings</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
