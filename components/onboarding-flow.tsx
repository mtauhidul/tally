// components/onboarding-flow.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { GoalSetting } from "@/components/goal-setting";
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
  FormDescription,
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
import { useAuth } from "@/contexts/auth-context";
import { authAPI, goalsAPI } from "@/services/api";
import { toast } from "sonner";

// Step 1: Personal info schema
const personalInfoSchema = z.object({
  height: z.string().min(1, {
    message: "Please enter your height.",
  }),
  weight: z.string().min(1, {
    message: "Please enter your weight.",
  }),
  sex: z.string({
    required_error: "Please select your sex.",
  }),
  age: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0 && num < 120;
    },
    {
      message: "Please enter a valid age.",
    }
  ),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function OnboardingFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Step 1 form
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      height: "",
      weight: "",
      sex: "",
      age: "",
    },
  });

  async function handleNextStep(data?: PersonalInfoValues) {
    if (data) {
      setIsLoading(true);
      try {
        // Update user profile with form data
        if (user) {
          await authAPI.updateProfile({
            height: Number(data.height),
            weight: Number(data.weight),
            age: Number(data.age),
            gender: data.sex,
          });
        } else {
          throw new Error("User is not authenticated");
        }

        // Store data for next steps
        setProfileData({
          height: Number(data.height),
          weight: Number(data.weight),
          gender: data.sex,
          age: Number(data.age),
        });

        setStep(step + 1);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error", {
          description:
            "Could not save your profile information. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  }

  async function handleGoalSet(goalData: {
    currentWeight: number;
    goalWeight: number;
    targetDate: string;
    type?: string;
    weeklyWeightChange?: number;
    nutrition?: {
      dailyCalories: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  }) {
    setIsLoading(true);
    try {
      // Create goal for user
      await goalsAPI.createGoal(goalData);

      // Mark onboarding as complete
      await authAPI.completeOnboarding();

      setStep(step + 1);
    } catch (error) {
      console.error("Error saving goal:", error);
      toast.error("Error", {
        description: "Could not save your goal information. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFinish() {
    router.push("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {step > 1 ? <CheckIcon className="h-5 w-5" /> : "1"}
            </div>
            <div
              className={`h-1 w-12 mx-1 ${
                step > 1 ? "bg-black" : "bg-gray-200"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {step > 2 ? <CheckIcon className="h-5 w-5" /> : "2"}
            </div>
            <div
              className={`h-1 w-12 mx-1 ${
                step > 2 ? "bg-black" : "bg-gray-200"
              }`}
            ></div>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {step > 3 ? <CheckIcon className="h-5 w-5" /> : "3"}
          </div>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <div className={step >= 1 ? "font-medium" : "text-muted-foreground"}>
            Basic Info
          </div>
          <div className={step >= 2 ? "font-medium" : "text-muted-foreground"}>
            Set Goal
          </div>
          <div className={step >= 3 ? "font-medium" : "text-muted-foreground"}>
            Finish
          </div>
        </div>
      </div>

      {/* Step 1: Basic information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to niblet.ai!</CardTitle>
            <CardDescription>
              Let&apos;s start by collecting some basic information to
              personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleNextStep)}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (inches)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 68"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your height in inches
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 180"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Used for metabolic calculations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 35"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Continue"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Goal setting */}
      {step === 2 && (
        <>
          <GoalSetting
            initialData={profileData}
            onGoalSet={handleGoalSet}
            isLoading={isLoading}
          />
          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </>
      )}

      {/* Step 3: Finish */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>You&apos;re all set!</CardTitle>
            <CardDescription>
              Your profile has been created and your goals are set.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckIcon className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="text-xl font-medium mb-2">Setup Complete!</h3>
            <p className="text-gray-600 mb-6">
              You&apos;re ready to start tracking your nutrition and progress
              toward your goals.
            </p>

            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleFinish}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
