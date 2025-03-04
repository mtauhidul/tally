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
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, Send, Upload } from "lucide-react";
import React, { useState } from "react";

interface HomeProps {
  user: {
    name: string;
    dailyCalorieBudget: number;
    caloriesConsumed: number;
    currentWeight: number;
    previousWeight: number;
  };
  onLogMeal: (message: string) => void;
  onLogWeight: (weight: number) => void;
  onAskQuestion: (question: string) => void;
}

const HomeDashboard: React.FC<HomeProps> = ({
  user,
  onLogMeal,
  onLogWeight,
  onAskQuestion,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: `Welcome back, ${user.name}! How can I help you today? You can log a meal, update your weight, or ask me anything about nutrition.`,
    },
  ]);

  const caloriesRemaining = user.dailyCalorieBudget - user.caloriesConsumed;
  const weightChange = user.currentWeight - user.previousWeight;

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    setChatMessages([...chatMessages, { role: "user", content: inputMessage }]);

    // Process message based on content
    if (inputMessage.toLowerCase().includes("weigh")) {
      // Extract weight from message
      const weightMatch = inputMessage.match(/\d+(\.\d+)?/);
      if (weightMatch) {
        const weight = parseFloat(weightMatch[0]);
        onLogWeight(weight);

        // Add system response
        const response =
          weightChange < 0
            ? "Great job! You're making progress on your weight loss journey!"
            : "Keep it up! Weight fluctuations happen—stay on track!";

        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I've logged your weight as ${weight} lbs. ${response}`,
          },
        ]);
      }
    } else if (
      inputMessage.toLowerCase().includes("eat") ||
      inputMessage.toLowerCase().includes("had") ||
      inputMessage.toLowerCase().includes("meal")
    ) {
      // Log a meal
      onLogMeal(inputMessage);

      // Simulate LLM response estimating calories
      const estimatedCalories = Math.floor(Math.random() * 300) + 200; // Just a placeholder simulation
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Based on your meal description, I estimate around ${estimatedCalories} calories. Is that correct? Your remaining calorie budget for today is now ${
            caloriesRemaining - estimatedCalories
          } calories.`,
        },
      ]);
    } else {
      // Treat as a general question
      onAskQuestion(inputMessage);

      // Simulate response (in a real app, this would come from the LLM)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'll help you with that! (This is a placeholder response that would be replaced by the actual LLM response in production)",
        },
      ]);
    }

    // Clear input
    setInputMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Calorie Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.dailyCalorieBudget} kcal
            </div>
            <p className="text-xs text-muted-foreground">
              {caloriesRemaining > 0
                ? `${caloriesRemaining} kcal remaining`
                : "Daily budget exceeded"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calories Consumed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.caloriesConsumed} kcal
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (user.caloriesConsumed / user.dailyCalorieBudget) *
                100
              ).toFixed(0)}
              % of daily budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Weight
            </CardTitle>
            {weightChange !== 0 && (
              <div
                className={`p-1 rounded-full ${
                  weightChange < 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {weightChange < 0 ? (
                  <ArrowDown className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-red-600" />
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.currentWeight} lbs</div>
            <p className="text-xs text-muted-foreground">
              {weightChange !== 0
                ? `${Math.abs(weightChange).toFixed(1)} lbs ${
                    weightChange < 0 ? "lost" : "gained"
                  } since last entry`
                : "No change since last entry"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Conversation Interface</CardTitle>
          <CardDescription>
            Log meals, track weight, and ask nutrition questions in a simple
            chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4 h-80 overflow-y-auto p-4 border rounded-lg">
              {chatMessages.map((message, index) => (
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

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder="Log a meal, update your weight, or ask a question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none"
                rows={1}
              />
              <Button type="submit" size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground mb-20">
          <div className="w-full text-center">
            <p className="mb-1">Examples:</p>
            <p>&quot;I had a turkey sandwich for lunch&quot;</p>
            <p>&quot;I weigh 185 lbs today&quot;</p>
            <p>&quot;How many calories in an avocado?&quot;</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomeDashboard;
