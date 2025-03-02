// components/chat-interface.tsx
"use client";

import { Camera, SendIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types for messages
type MessageType =
  | "user"
  | "system"
  | "calorie-estimate"
  | "weight-update"
  | "question";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata?: {
    calories?: number;
    weight?: number;
    confirmed?: boolean;
  };
}

// Sample calorie data (simulate LLM response)
const estimateCalories = (meal: string): number => {
  // In a real app, this would call an LLM API
  const mealMap: Record<string, number> = {
    bagel: 280,
    "cream cheese": 100,
    coffee: 5,
    "black coffee": 5,
    "turkey sandwich": 350,
    latte: 120,
    "oat milk": 30,
    "greek yogurt": 150,
    berries: 85,
    oatmeal: 150,
    banana: 105,
    pizza: 300,
    salad: 120,
    chicken: 165,
    rice: 200,
    pasta: 220,
    "ice cream": 260,
    apple: 95,
    sandwich: 350,
    smoothie: 200,
  };

  // Very simple word matching for demo purposes
  let totalCalories = 0;
  const lowerMeal = meal.toLowerCase();

  Object.entries(mealMap).forEach(([food, calories]) => {
    if (lowerMeal.includes(food)) {
      totalCalories += calories;
    }
  });

  // If no specific foods matched, provide a reasonable estimate based on meal size
  if (totalCalories === 0) {
    if (lowerMeal.includes("breakfast")) totalCalories = 400;
    else if (lowerMeal.includes("lunch")) totalCalories = 600;
    else if (lowerMeal.includes("dinner")) totalCalories = 700;
    else if (lowerMeal.includes("snack")) totalCalories = 150;
    else totalCalories = 350; // Default estimate
  }

  return totalCalories;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content:
        "Welcome to Tally! How can I help you today? You can log a meal, update your weight, or ask nutrition questions.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Auto scroll to bottom
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 100);

    // Process the user message (simulate LLM processing)
    setTimeout(() => {
      const lowerInput = input.toLowerCase();

      // Handle meal logging
      if (
        lowerInput.includes("had") ||
        lowerInput.includes("ate") ||
        lowerInput.includes("for breakfast") ||
        lowerInput.includes("for lunch") ||
        lowerInput.includes("for dinner") ||
        lowerInput.includes("consumed")
      ) {
        const calories = estimateCalories(input);

        const calorieResponse: Message = {
          id: Date.now().toString(),
          type: "calorie-estimate",
          content: `I estimate that "${input}" is approximately ${calories} calories. Is this correct?`,
          timestamp: new Date(),
          metadata: {
            calories,
            confirmed: false,
          },
        };

        setMessages((prev) => [...prev, calorieResponse]);
      }
      // Handle weight updating
      else if (
        lowerInput.includes("weigh") ||
        lowerInput.includes("weight") ||
        lowerInput.includes("pounds") ||
        lowerInput.includes("lbs") ||
        lowerInput.includes("kg")
      ) {
        // Extract weight number from input
        const weightMatch = input.match(/(\d+\.?\d*)\s*(kg|pounds|lbs)/i);
        const weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
        const unit = weightMatch ? weightMatch[2].toLowerCase() : "lbs";

        // Convert to standard unit if needed (lbs for this example)
        const standardWeight = unit === "kg" ? weight * 2.20462 : weight;

        const weightResponse: Message = {
          id: Date.now().toString(),
          type: "weight-update",
          content: `Got it! I've recorded your weight as ${standardWeight.toFixed(
            1
          )} lbs. Great job tracking this - consistency is key!`,
          timestamp: new Date(),
          metadata: {
            weight: standardWeight,
          },
        };

        setMessages((prev) => [...prev, weightResponse]);
      }
      // Handle nutrition questions
      else if (
        lowerInput.includes("how many") ||
        lowerInput.includes("calorie") ||
        lowerInput.includes("nutrition") ||
        lowerInput.includes("healthy") ||
        lowerInput.includes("protein") ||
        lowerInput.includes("?")
      ) {
        const questionResponse: Message = {
          id: Date.now().toString(),
          type: "question",
          content:
            "I'd be happy to help with your nutrition question! A healthy adult diet typically consists of 2000-2500 calories per day, but your needs may vary based on age, activity level, and goals. Would you like me to suggest some meal options based on your calorie target?",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, questionResponse]);
      }
      // Default response
      else {
        const defaultResponse: Message = {
          id: Date.now().toString(),
          type: "system",
          content:
            "I'm not sure I understand. You can log a meal by saying something like 'I had a turkey sandwich for lunch', update your weight with 'I weigh 180 lbs today', or ask me nutrition questions.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, defaultResponse]);
      }

      setIsLoading(false);

      // Auto scroll to bottom after response
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }, 1000);
  };

  const handleConfirmCalories = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const calories = msg.metadata?.calories || 0;
          return {
            ...msg,
            content: `I've logged ${calories} calories for your meal. Great job staying on track!`,
            metadata: {
              ...msg.metadata,
              confirmed: true,
            },
          };
        }
        return msg;
      })
    );
  };

  const handleAdjustCalories = (messageId: string, newCalories: number) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            content: `I've logged ${newCalories} calories for your meal. Thanks for the correction!`,
            metadata: {
              ...msg.metadata,
              calories: newCalories,
              confirmed: true,
            },
          };
        }
        return msg;
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageCapture = () => {
    // In a real app, this would open the camera or file dialog
    alert(
      "In a real app, this would open the camera to take a picture of your meal"
    );
  };

  return (
    <Card className="flex flex-col h-[600px] border shadow-md">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>

                {/* Calorie confirmation UI */}
                {message.type === "calorie-estimate" &&
                  !message.metadata?.confirmed && (
                    <div className="mt-2 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleConfirmCalories(message.id)}
                      >
                        Yes, correct
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const current = message.metadata?.calories || 0;
                          const adjusted = Math.max(0, current - 50);
                          handleAdjustCalories(message.id, adjusted);
                        }}
                      >
                        Lower
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const current = message.metadata?.calories || 0;
                          const adjusted = current + 50;
                          handleAdjustCalories(message.id, adjusted);
                        }}
                      >
                        Higher
                      </Button>
                    </div>
                  )}

                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <CardContent className="border-t p-4">
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={handleImageCapture}
          >
            <Camera className="h-5 w-5" />
            <span className="sr-only">Add image</span>
          </Button>
          <div className="relative flex-1">
            <Input
              placeholder="Log a meal, update weight, or ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Try: &quot;I had a turkey sandwich for lunch&quot; or &quot;I weigh
          165 lbs today&quot;
        </p>
      </CardContent>
    </Card>
  );
}
