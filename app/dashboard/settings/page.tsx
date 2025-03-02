"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  age: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Please enter a valid age.",
  }),
  height: z.string().min(1, {
    message: "Please enter your height.",
  }),
  weight: z.string().min(1, {
    message: "Please enter your weight.",
  }),
  gender: z.string().optional(),
  activityLevel: z.string().optional(),
});

// Goals form schema
const goalsFormSchema = z.object({
  dailyCalories: z.string().min(1, {
    message: "Please enter your daily calorie goal.",
  }),
  protein: z.string().min(1, {
    message: "Please enter your protein goal.",
  }),
  carbs: z.string().min(1, {
    message: "Please enter your carbs goal.",
  }),
  fat: z.string().min(1, {
    message: "Please enter your fat goal.",
  }),
  goal: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type GoalsFormValues = z.infer<typeof goalsFormSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      age: "32",
      height: "175",
      weight: "70",
      gender: "male",
      activityLevel: "moderate",
    },
  });

  // Goals form
  const goalsForm = useForm<GoalsFormValues>({
    resolver: zodResolver(goalsFormSchema),
    defaultValues: {
      dailyCalories: "2000",
      protein: "120",
      carbs: "250",
      fat: "65",
      goal: "maintain",
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  function onGoalsSubmit(data: GoalsFormValues) {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">
                                Sedentary
                              </SelectItem>
                              <SelectItem value="light">
                                Lightly Active
                              </SelectItem>
                              <SelectItem value="moderate">
                                Moderately Active
                              </SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="very-active">
                                Very Active
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
              <CardDescription>
                Set your daily nutrition targets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...goalsForm}>
                <form
                  onSubmit={goalsForm.handleSubmit(onGoalsSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={goalsForm.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fitness Goal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lose">Lose Weight</SelectItem>
                            <SelectItem value="maintain">
                              Maintain Weight
                            </SelectItem>
                            <SelectItem value="gain">Gain Weight</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={goalsForm.control}
                      name="dailyCalories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Calories (kcal)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="sm:col-span-2">
                      <Separator className="my-4" />
                      <h3 className="mb-4 text-sm font-medium">
                        Macronutrient Goals
                      </h3>
                    </div>
                    <FormField
                      control={goalsForm.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={goalsForm.control}
                      name="carbs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbohydrates (g)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={goalsForm.control}
                      name="fat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fat (g)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Goals"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize how Tally works for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Dark Mode</h3>
                    <p className="text-xs text-muted-foreground">
                      Switch between light and dark themes.
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Meal Reminders</h3>
                    <p className="text-xs text-muted-foreground">
                      Get notifications to log your meals.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Units</h3>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred measurement system.
                    </p>
                  </div>
                  <Select defaultValue="metric">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric</SelectItem>
                      <SelectItem value="imperial">Imperial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-black text-white hover:bg-gray-800">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Change Password
                    </h3>
                    <div className="space-y-2">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button className="mt-4 bg-black text-white hover:bg-gray-800">
                      Update Password
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Export Data</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Download a copy of all your data.
                      </p>
                      <Button variant="outline">Export All Data</Button>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-red-600">
                        Danger Zone
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Permanently delete your account and all data.
                      </p>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
