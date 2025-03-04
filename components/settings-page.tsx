import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Save } from "lucide-react";
import React, { useState } from "react";

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  dailyCalorieBudget: number;
  notifications: {
    dailyReminders: boolean;
    weeklyProgress: boolean;
    achievements: boolean;
  };
  goalWeight: number;
  goalDate: string;
  unitPreference: "imperial" | "metric";
  caloriesConsumed: number;
  currentWeight: number;
  previousWeight: number;
  isOnboarded: boolean;
}

interface SettingsPageProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      onSaveSettings(userSettings);
      setIsSaving(false);
      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-1">
          <TabsTrigger
            value="profile"
            className="px-2 py-1.5 text-xs md:text-sm truncate"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="px-2 py-1.5 text-xs md:text-sm truncate"
          >
            Goals & Tracking
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="px-2 py-1.5 text-xs md:text-sm truncate"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userSettings.name}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={userSettings.phone}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unit Preferences</CardTitle>
              <CardDescription>
                Choose your preferred measurement units
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={userSettings.unitPreference}
                onValueChange={(value: "imperial" | "metric") =>
                  setUserSettings((prev) => ({
                    ...prev,
                    unitPreference: value,
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Imperial (pounds, inches)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">
                    Metric (kilograms, centimeters)
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight Goals</CardTitle>
              <CardDescription>
                Update your target weight and goal date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalWeight">Target Weight</Label>
                <div className="flex space-x-2">
                  <Input
                    id="goalWeight"
                    type="number"
                    value={userSettings.goalWeight}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        goalWeight: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <span className="flex items-center text-sm text-muted-foreground">
                    {userSettings.unitPreference === "imperial" ? "lbs" : "kg"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalDate">Target Date</Label>
                <Input
                  id="goalDate"
                  type="date"
                  value={userSettings.goalDate}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      goalDate: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Budget</CardTitle>
              <CardDescription>
                Update your daily calorie target
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="calorieTarget">Daily Calorie Target</Label>
                <div className="flex space-x-2">
                  <Input
                    id="calorieTarget"
                    type="number"
                    value={userSettings.dailyCalorieBudget}
                    onChange={(e) =>
                      setUserSettings((prev) => ({
                        ...prev,
                        dailyCalorieBudget: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <span className="flex items-center text-sm text-muted-foreground">
                    kcal
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you&apos;d like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminders">Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders to log your meals and weight
                  </p>
                </div>
                <Switch
                  id="daily-reminders"
                  checked={userSettings.notifications.dailyReminders}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        dailyReminders: checked,
                      },
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-progress">Weekly Progress</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summaries of your progress
                  </p>
                </div>
                <Switch
                  id="weekly-progress"
                  checked={userSettings.notifications.weeklyProgress}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        weeklyProgress: checked,
                      },
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="achievements">Achievements</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you reach milestones
                  </p>
                </div>
                <Switch
                  id="achievements"
                  checked={userSettings.notifications.achievements}
                  onCheckedChange={(checked) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        achievements: checked,
                      },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6 mb-24 space-x-2">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center"
        >
          {isSaving ? (
            <>
              <span className="mr-2">Saving...</span>
              <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
            </>
          ) : saveSuccess ? (
            <>
              Saved <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Save Settings <Save className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
