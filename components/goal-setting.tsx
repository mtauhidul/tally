// components/goal-setting.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addWeeks, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Slider } from "@/components/ui/slider";
import { goalsAPI } from "@/services/api";

const goalFormSchema = z.object({
  currentWeight: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0 && num < 1000;
    },
    {
      message: "Please enter a valid weight.",
    }
  ),
  goalWeight: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0 && num < 1000;
    },
    {
      message: "Please enter a valid weight.",
    }
  ),
  targetDate: z.date({
    required_error: "Please select a target date.",
  }),
  activityLevel: z.string({
    required_error: "Please select your activity level.",
  }),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalSettingProps {
  initialData?: {
    weight?: number;
    height?: number;
    gender?: string;
    age?: number;
  };
  onGoalSet?: (goalData: any) => void;
  isLoading?: boolean;
}

const activityLevels = [
  {
    value: "sedentary",
    label: "Sedentary (little or no exercise)",
    multiplier: 1.2,
  },
  {
    value: "light",
    label: "Lightly active (light exercise 1-3 days/week)",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    label: "Moderately active (moderate exercise 3-5 days/week)",
    multiplier: 1.55,
  },
  {
    value: "active",
    label: "Active (hard exercise 6-7 days/week)",
    multiplier: 1.725,
  },
  {
    value: "very-active",
    label: "Very active (very hard exercise and physical job)",
    multiplier: 1.9,
  },
];

export function GoalSetting({
  initialData,
  onGoalSet,
  isLoading = false,
}: GoalSettingProps) {
  const [recommendedCalories, setRecommendedCalories] = useState<number>(0);
  const [weightLossRate, setWeightLossRate] = useState<number>(1); // 1 lb per week
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [calculatingCalories, setCalculatingCalories] =
    useState<boolean>(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      currentWeight: initialData?.weight ? String(initialData.weight) : "",
      goalWeight: "",
      targetDate: addWeeks(new Date(), 12), // Default to 12 weeks
      activityLevel: "moderate",
    },
  });

  // Update recommended calories using API when form values change or weight loss rate changes
  const handleCalculateCalories = async () => {
    const formValues = form.getValues();

    // Skip if required values are missing
    if (
      !formValues.currentWeight ||
      !formValues.activityLevel ||
      !initialData
    ) {
      return;
    }

    setCalculatingCalories(true);

    try {
      const response = await goalsAPI.calculateCalories({
        currentWeight: Number(formValues.currentWeight),
        goalWeight: formValues.goalWeight
          ? Number(formValues.goalWeight)
          : undefined,
        height: initialData.height || 0,
        age: initialData.age || 0,
        gender: initialData.gender || "male",
        activityLevel: formValues.activityLevel,
        weeklyWeightChange: -weightLossRate, // Negative for weight loss
      });

      setRecommendedCalories(response.data.data.recommendedCalories);
    } catch (error) {
      console.error("Error calculating calories:", error);
      // Fallback to a simple calculation
      const currentWeight = parseFloat(formValues.currentWeight);
      const activityMultiplier =
        activityLevels.find((level) => level.value === formValues.activityLevel)
          ?.multiplier || 1.55;

      // Basic BMR and calorie calculation
      const bmr = 10 * currentWeight + 1000;
      const maintenanceCalories = Math.round(bmr * activityMultiplier);
      const deficit = weightLossRate * 500;

      setRecommendedCalories(Math.max(1200, maintenanceCalories - deficit));
    } finally {
      setCalculatingCalories(false);
    }
  };

  // Call calorie calculation when form values change
  useEffect(() => {
    handleCalculateCalories();
  }, [
    weightLossRate,
    form.watch("activityLevel"),
    form.watch("currentWeight"),
    form.watch("goalWeight"),
  ]);

  // Prepare goal data and submit
  function onSubmit(data: GoalFormValues) {
    // Convert string values to numbers
    const currentWeight = Number(data.currentWeight);
    const goalWeight = Number(data.goalWeight);

    // Determine goal type
    let goalType = "maintain";
    if (goalWeight < currentWeight) {
      goalType = "lose";
    } else if (goalWeight > currentWeight) {
      goalType = "gain";
    }

    // Prepare goal data
    const goalData = {
      type: goalType,
      currentWeight,
      goalWeight,
      targetDate: data.targetDate.toISOString(),
      weeklyWeightChange:
        goalType === "lose"
          ? -weightLossRate
          : goalType === "gain"
          ? weightLossRate
          : 0,
      nutrition: {
        dailyCalories: recommendedCalories,
        protein: Math.round((recommendedCalories * 0.3) / 4), // 30% from protein
        carbs: Math.round((recommendedCalories * 0.45) / 4), // 45% from carbs
        fat: Math.round((recommendedCalories * 0.25) / 9), // 25% from fat
      },
    };

    // Call the onGoalSet callback if provided
    if (onGoalSet) {
      onGoalSet(goalData);
    } else {
      setShowConfirmation(true);
    }
  }

  return (
    <Card className="border shadow-md max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Set Your Weight Goal</CardTitle>
        <CardDescription>
          Tell us about your current weight and goals, and we'll help you track
          your progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <div className="space-y-4 text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Your Goal Is Set!</h3>
            <p className="text-gray-600">
              We've calculated your recommended daily intake to be{" "}
              <span className="font-bold">{recommendedCalories} calories</span>.
              This will help you reach your goal weight of{" "}
              <span className="font-bold">
                {form.getValues().goalWeight} lbs
              </span>{" "}
              by{" "}
              <span className="font-bold">
                {format(form.getValues().targetDate, "MMMM d, yyyy")}
              </span>
              .
            </p>
            <div className="pt-4">
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 180"
                          {...field}
                          type="number"
                          min="50"
                          max="500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 160"
                          {...field}
                          type="number"
                          min="50"
                          max="500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "MMMM d, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a realistic date for achieving your goal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCalculateCalories();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us calculate your daily calorie needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Weekly Weight Loss Rate
                </label>
                <Slider
                  defaultValue={[1]}
                  max={2}
                  min={0.5}
                  step={0.25}
                  onValueChange={(value) => {
                    setWeightLossRate(value[0]);
                    handleCalculateCalories();
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow & Steady (0.5 lbs/week)</span>
                  <span>Moderate (1 lb/week)</span>
                  <span>Aggressive (2 lbs/week)</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Current selection:{" "}
                  <span className="font-medium">{weightLossRate} lbs</span> per
                  week
                </p>
              </div>

              {recommendedCalories > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    Recommended Daily Calories
                  </h3>
                  <div className="text-2xl font-bold">
                    {calculatingCalories
                      ? "Calculating..."
                      : `${recommendedCalories} calories`}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your information and selected weight loss rate
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={isLoading || calculatingCalories}
              >
                {isLoading ? "Setting Goal..." : "Set Goal"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
