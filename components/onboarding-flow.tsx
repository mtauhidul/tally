import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check } from "lucide-react";
import React, { useState } from "react";

interface OnboardingFlowProps {
  onComplete: (userData: {
    height: number;
    weight: number;
    sex: string;
    age: number;
    goalWeight: number;
    goalDate: string;
    activityLevel: string;
    dailyCalorieBudget: number;
    unitPreference: "imperial" | "metric";
  }) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    height: 0, // in inches or cm
    weight: 0, // in lbs or kg
    sex: "male",
    age: 30,
    goalWeight: 0, // in lbs or kg
    goalDate: "",
    activityLevel: "moderate",
    unitPreference: "imperial" as "imperial" | "metric",
    dailyCalorieBudget: 0,
  });

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Welcome to niblet.ai! Let's set up your profile to help you reach your weight goals. First, I'll need some basic information about you.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  // Function to calculate BMR based on Harris-Benedict equation
  const calculateBMR = () => {
    const weight =
      userData.unitPreference === "imperial"
        ? userData.weight * 0.453592 // convert lbs to kg
        : userData.weight;

    const height =
      userData.unitPreference === "imperial"
        ? userData.height * 2.54 // convert inches to cm
        : userData.height;

    if (userData.sex === "male") {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * userData.age;
    } else {
      return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * userData.age;
    }
  };

  // Calculate daily calorie needs based on activity level
  const calculateDailyCaloricNeeds = () => {
    const bmr = calculateBMR();
    let activityMultiplier = 1.2; // Sedentary

    switch (userData.activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2;
        break;
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "very":
        activityMultiplier = 1.9;
        break;
    }

    // Calculate maintenance calories
    const maintenanceCalories = bmr * activityMultiplier;

    // For weight loss: typically a 500 calorie deficit for 1lb/week loss
    // For weight gain: typically a 500 calorie surplus for 1lb/week gain
    const weightDifference = userData.goalWeight - userData.weight;
    const isWeightLoss = weightDifference < 0;

    // Calculate calorie adjustment (rough estimate)
    const calorieAdjustment = isWeightLoss
      ? -500
      : weightDifference > 0
      ? 500
      : 0;

    return Math.round(maintenanceCalories + calorieAdjustment);
  };

  const handleNextStep = () => {
    // Process step data
    if (step === 4) {
      // Final step - calculate daily calorie budget
      const calculatedCaloricNeeds = calculateDailyCaloricNeeds();
      setUserData((prev) => ({
        ...prev,
        dailyCalorieBudget: calculatedCaloricNeeds,
      }));

      // Call onComplete with final user data
      onComplete({
        ...userData,
        dailyCalorieBudget: calculatedCaloricNeeds,
      });
    } else {
      setStep(step + 1);
      addAssistantMessage(getStepPrompt(step + 1));
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getStepPrompt = (stepNumber: number): string => {
    switch (stepNumber) {
      case 1:
        return "Let's start with your basic information. What's your height, weight, age, and sex?";
      case 2:
        return "Great! Now, let's set your weight goal. What's your target weight and by when would you like to reach it?";
      case 3:
        return "How would you describe your activity level?";
      case 4:
        return "Last step! Based on the information you've provided, I'm calculating your recommended daily calorie intake.";
      default:
        return "";
    }
  };

  const addAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
  };

  const handleSubmitConversational = () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);

    // Process the message based on current step
    if (step === 1) {
      // Parse basic info from message
      const heightMatch = inputMessage.match(
        /(\d+)[\s']*(ft|cm|feet|foot|in|inch|inches|'|")/i
      );
      const weightMatch = inputMessage.match(
        /(\d+)[\s]*(lbs|kg|pounds|kilograms)/i
      );
      const ageMatch = inputMessage.match(/(\d+)[\s]*(years|year|yr|y)/i);
      const sexMatch = inputMessage.match(/(male|female|man|woman)/i);

      const newData = { ...userData };
      let unitUpdated = false;

      if (heightMatch) {
        const value = parseInt(heightMatch[1]);
        const unit = heightMatch[2].toLowerCase();

        if (unit === "cm") {
          newData.height = value;
          newData.unitPreference = "metric";
          unitUpdated = true;
        } else {
          // Assume feet or inches
          newData.height =
            unit.includes("ft") || unit === "'" ? value * 12 : value;
          newData.unitPreference = "imperial";
          unitUpdated = true;
        }
      }

      if (weightMatch) {
        const value = parseInt(weightMatch[1]);
        const unit = weightMatch[2].toLowerCase();

        if (unit === "kg" || unit === "kilograms") {
          newData.weight = value;
          if (!unitUpdated) newData.unitPreference = "metric";
        } else {
          newData.weight = value;
          if (!unitUpdated) newData.unitPreference = "imperial";
        }
      }

      if (ageMatch) {
        newData.age = parseInt(ageMatch[1]);
      }

      if (sexMatch) {
        const sex = sexMatch[1].toLowerCase();
        newData.sex = sex === "man" ? "male" : sex === "woman" ? "female" : sex;
      }

      setUserData(newData);

      // Move to next step automatically if all required fields are filled
      if (
        newData.height > 0 &&
        newData.weight > 0 &&
        newData.age > 0 &&
        newData.sex
      ) {
        setTimeout(() => {
          handleNextStep();
        }, 1000);
      } else {
        // Ask for missing information
        addAssistantMessage(
          "I still need some information. Please provide your " +
            (!newData.height ? "height, " : "") +
            (!newData.weight ? "weight, " : "") +
            (!newData.age ? "age, " : "") +
            (!newData.sex ? "sex " : "")
        );
      }
    } else if (step === 2) {
      // Parse goal weight and date
      const goalWeightMatch = inputMessage.match(
        /(\d+)[\s]*(lbs|kg|pounds|kilograms)/i
      );
      const dateMatch =
        inputMessage.match(
          /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\s.,-]+(\d{1,2})(?:st|nd|rd|th)?(?:[\s.,]+(\d{4}))?/i
        ) ||
        inputMessage.match(
          /(\d{1,2})[\s.,-]+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:[\s.,]+(\d{4}))?/i
        ) ||
        inputMessage.match(/(\d{1,2})[\s.,-]+(\d{1,2})[\s.,-]+(\d{4})/i);

      const newData = { ...userData };

      if (goalWeightMatch) {
        const value = parseInt(goalWeightMatch[1]);
        const unit = goalWeightMatch[2].toLowerCase();

        if (
          (unit === "kg" || unit === "kilograms") &&
          userData.unitPreference === "imperial"
        ) {
          // Convert kg to lbs
          newData.goalWeight = Math.round(value * 2.20462);
        } else if (
          (unit === "lbs" || unit === "pounds") &&
          userData.unitPreference === "metric"
        ) {
          // Convert lbs to kg
          newData.goalWeight = Math.round(value * 0.453592);
        } else {
          newData.goalWeight = value;
        }
      }

      if (dateMatch) {
        const today = new Date();
        let month, day, year;

        if (
          dateMatch[1].match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)
        ) {
          // Format: Month Day Year
          const monthMap: { [key: string]: number } = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
          };
          month = monthMap[dateMatch[1].toLowerCase()];
          day = parseInt(dateMatch[2]);
          year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();
        } else if (
          dateMatch[2] &&
          dateMatch[2].match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)
        ) {
          // Format: Day Month Year
          const monthMap: { [key: string]: number } = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
          };
          day = parseInt(dateMatch[1]);
          month = monthMap[dateMatch[2].toLowerCase()];
          year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();
        } else {
          // Format: DD-MM-YYYY
          day = parseInt(dateMatch[1]);
          month = parseInt(dateMatch[2]) - 1; // Month is 0-indexed in JS Date
          year = parseInt(dateMatch[3]);
        }

        // Ensure year is valid (allow 2-digit year inputs)
        if (year < 100) {
          year += 2000;
        }

        // Create date and format as ISO string
        const goalDate = new Date(year, month, day);
        newData.goalDate = goalDate.toISOString().split("T")[0];
      }

      setUserData(newData);

      // Move to next step automatically if all required fields are filled
      if (newData.goalWeight > 0 && newData.goalDate) {
        setTimeout(() => {
          handleNextStep();
        }, 1000);
      } else {
        // Ask for missing information
        addAssistantMessage(
          "I still need some information. Please provide your " +
            (!newData.goalWeight ? "target weight, " : "") +
            (!newData.goalDate ? "target date " : "")
        );
      }
    } else if (step === 3) {
      // Parse activity level
      const activityLevel = inputMessage.match(
        /sedentary|barely|not active|don't exercise/i
      )
        ? "sedentary"
        : inputMessage.match(/light|mild|casual|walk|1-2 times/i)
        ? "light"
        : inputMessage.match(/moderate|medium|average|3-5 times/i)
        ? "moderate"
        : inputMessage.match(/active|high|intense|6-7 times/i)
        ? "active"
        : inputMessage.match(/very active|athlete|twice daily|extreme/i)
        ? "very"
        : null;

      if (activityLevel) {
        setUserData((prev) => ({ ...prev, activityLevel }));
        setTimeout(() => {
          handleNextStep();
        }, 1000);
      } else {
        addAssistantMessage(
          "I didn't catch that. How would you describe your activity level? (Sedentary, Light, Moderate, Active, or Very Active)"
        );
      }
    }

    // Reset input after processing
    setInputMessage("");
  };

  // Handle form submission for structured approach
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNextStep();
  };

  return (
    <div className="container max-w-lg mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to niblet.ai</CardTitle>
          <CardDescription>
            Step {step} of 4:{" "}
            {step === 1
              ? "Basic Information"
              : step === 2
              ? "Set Your Weight Goal"
              : step === 3
              ? "Activity Level"
              : "Calorie Budget"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Conversational Interface */}
            <div className="space-y-4 mb-4 h-60 overflow-y-auto p-4 border rounded-lg">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>NB</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Conversational Input */}
            <div className="flex items-center space-x-2">
              <Textarea
                placeholder={
                  step === 1
                    ? "Enter your height, weight, age, and sex..."
                    : step === 2
                    ? "Enter your target weight and goal date..."
                    : step === 3
                    ? "Describe your activity level..."
                    : "Any additional information..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitConversational();
                  }
                }}
                className="resize-none"
                rows={2}
              />
              <Button
                type="submit"
                size="icon"
                onClick={handleSubmitConversational}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Structured form as alternative */}
            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium mb-3">
                Or enter information directly:
              </h3>

              <form onSubmit={handleFormSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="height"
                            type="number"
                            placeholder={
                              userData.unitPreference === "imperial"
                                ? "inches"
                                : "cm"
                            }
                            value={userData.height || ""}
                            onChange={(e) =>
                              setUserData((prev) => ({
                                ...prev,
                                height: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="weight"
                            type="number"
                            placeholder={
                              userData.unitPreference === "imperial"
                                ? "lbs"
                                : "kg"
                            }
                            value={userData.weight || ""}
                            onChange={(e) =>
                              setUserData((prev) => ({
                                ...prev,
                                weight: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={userData.age || ""}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              age: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sex">Sex</Label>
                        <Select
                          value={userData.sex}
                          onValueChange={(value) =>
                            setUserData((prev) => ({ ...prev, sex: value }))
                          }
                        >
                          <SelectTrigger id="sex">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="units">Unit Preference</Label>
                      <Select
                        value={userData.unitPreference}
                        onValueChange={(value: "imperial" | "metric") =>
                          setUserData((prev) => ({
                            ...prev,
                            unitPreference: value,
                          }))
                        }
                      >
                        <SelectTrigger id="units">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imperial">
                            Imperial (lbs, in)
                          </SelectItem>
                          <SelectItem value="metric">
                            Metric (kg, cm)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goalWeight">Target Weight</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="goalWeight"
                          type="number"
                          placeholder={
                            userData.unitPreference === "imperial"
                              ? "lbs"
                              : "kg"
                          }
                          value={userData.goalWeight || ""}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              goalWeight: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goalDate">Target Date</Label>
                      <Input
                        id="goalDate"
                        type="date"
                        value={userData.goalDate}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            goalDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Activity Level</Label>
                      <RadioGroup
                        value={userData.activityLevel}
                        onValueChange={(value) =>
                          setUserData((prev) => ({
                            ...prev,
                            activityLevel: value,
                          }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sedentary" id="sedentary" />
                          <Label htmlFor="sedentary">
                            Sedentary (little or no exercise)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light">
                            Light (exercise 1-3 times/week)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="moderate" />
                          <Label htmlFor="moderate">
                            Moderate (exercise 3-5 times/week)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active">
                            Active (exercise 6-7 times/week)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="very" id="very" />
                          <Label htmlFor="very">
                            Very Active (intense exercise daily)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="font-semibold mb-2">
                        Your Daily Calorie Budget
                      </h3>
                      <div className="text-3xl font-bold">
                        {calculateDailyCaloricNeeds()} kcal
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on your information, this is the recommended daily
                        calorie intake to reach your goal weight by{" "}
                        {new Date(userData.goalDate).toLocaleDateString()}.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customCalories">
                        Adjust Calorie Budget (Optional)
                      </Label>
                      <Input
                        id="customCalories"
                        type="number"
                        placeholder="Custom daily calorie budget"
                        value={userData.dailyCalorieBudget || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            dailyCalorieBudget: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNextStep}>
            {step < 4 ? "Next" : "Complete Setup"}
            {step < 4 ? (
              <ArrowRight className="ml-2 h-4 w-4" />
            ) : (
              <Check className="ml-2 h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
