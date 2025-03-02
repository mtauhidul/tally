// components/chat-interface.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMeals } from "@/hooks/useMeals";
import { useWeight } from "@/hooks/useWeight";
import { Camera, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
    mealId?: string;
    weightId?: string;
    mealType?: string;
  };
}

export function ChatInterface() {
  const { analyzeMealText, createMeal } = useMeals();
  const { createWeightEntry, analyzeWeightFromText } = useWeight();

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
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
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

    try {
      const lowerInput = input.toLowerCase();

      // Check if input is related to weight
      const weightValue = analyzeWeightFromText(input);

      if (weightValue) {
        // Handle weight logging
        await handleWeightLog(input, weightValue);
      }
      // Check if input is related to food
      else if (
        lowerInput.includes("had") ||
        lowerInput.includes("ate") ||
        lowerInput.includes("for breakfast") ||
        lowerInput.includes("for lunch") ||
        lowerInput.includes("for dinner") ||
        lowerInput.includes("consumed")
      ) {
        // Handle meal logging
        await handleMealLog(input);
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
        await handleNutritionQuestion();
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
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle meal logging
  const handleMealLog = async (text: string) => {
    try {
      // Determine meal type
      const lowerText = text.toLowerCase();
      let mealType = "snack";

      if (lowerText.includes("breakfast")) {
        mealType = "breakfast";
      } else if (lowerText.includes("lunch")) {
        mealType = "lunch";
      } else if (lowerText.includes("dinner")) {
        mealType = "dinner";
      }

      // Analyze text for calories
      const nutritionData = await analyzeMealText(text);

      if (nutritionData) {
        // Show calorie estimate and ask for confirmation
        const calorieResponse: Message = {
          id: Date.now().toString(),
          type: "calorie-estimate",
          content: `I estimate that "${text}" is approximately ${nutritionData.calories} calories. Is this correct?`,
          timestamp: new Date(),
          metadata: {
            calories: nutritionData.calories,
            confirmed: false,
            mealType: mealType,
          },
        };

        setMessages((prev) => [...prev, calorieResponse]);
      } else {
        // If analysis fails, show generic response
        const fallbackResponse: Message = {
          id: Date.now().toString(),
          type: "system",
          content:
            "I couldn't analyze that meal. Could you please provide more details or try again?",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, fallbackResponse]);
        toast.error(
          "Failed to analyze the meal. Please try again with more details."
        );
      }
    } catch (error) {
      console.error("Error handling meal log:", error);
      toast.error("Error analyzing meal. Please try again.");
      throw error;
    }
  };

  // Handle weight logging
  const handleWeightLog = async (text: string, weightValue: number) => {
    try {
      // Create weight entry
      const entry = await createWeightEntry({
        weight: weightValue,
        date: new Date().toISOString(),
        notes: `Logged via chat: "${text}"`,
      });

      if (entry) {
        const weightResponse: Message = {
          id: Date.now().toString(),
          type: "weight-update",
          content: `Great! I've recorded your weight as ${weightValue.toFixed(
            1
          )} lbs. ${getWeightFeedback()}`,
          timestamp: new Date(),
          metadata: {
            weight: weightValue,
            weightId: entry._id,
          },
        };

        setMessages((prev) => [...prev, weightResponse]);
      } else {
        throw new Error("Failed to create weight entry");
      }
    } catch (error) {
      console.error("Error handling weight log:", error);
      toast.error("Error recording weight. Please try again.");
      throw error;
    }
  };

  // Handle nutrition questions
  const handleNutritionQuestion = async () => {
    // For now, provide a generic response
    // In a production app, this would use a real NLP/AI service
    const questionResponse: Message = {
      id: Date.now().toString(),
      type: "question",
      content:
        "I'd be happy to help with your nutrition question! A healthy adult diet typically consists of 2000-2500 calories per day, but your needs may vary based on age, activity level, and goals. Would you like me to suggest some meal options based on your calorie target?",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, questionResponse]);
  };

  // Provide encouraging feedback based on weight
  const getWeightFeedback = () => {
    const encouragements = [
      "Keep up the good work with your tracking!",
      "Consistency is key to reaching your goals.",
      "Great job staying committed to your health journey!",
      "Every weigh-in brings you closer to your goals.",
      "Your dedication to tracking is inspiring!",
    ];

    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  // Handle confirming calories
  const handleConfirmCalories = async (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    const mealDescription = message.content.split('"')[1] || "";
    const calories = message.metadata?.calories || 0;

    const mealData = {
      name: mealDescription,
      calories: calories,
      date: new Date().toISOString(),
      description: mealDescription,
      mealType: determineMealType(message.content),
      entryMethod: "text",
      originalText: mealDescription,
      nutrition: {
        protein: Math.round((calories * 0.3) / 4), // 30% protein
        carbs: Math.round((calories * 0.5) / 4), // 50% carbs
        fat: Math.round((calories * 0.2) / 9), // 20% fat
      },
    };

    try {
      await createMeal(mealData);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
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

      toast.success("Meal logged successfully!");
    } catch (error) {
      console.error("Error confirming calories:", error);
      toast.error("Failed to log meal. Please try again.");
    }
  };

  // Determine meal type from message content
  const determineMealType = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("breakfast")) return "breakfast";
    if (lowerContent.includes("lunch")) return "lunch";
    if (lowerContent.includes("dinner")) return "dinner";
    return "snack";
  };

  // Handle adjusting calories
  const handleAdjustCalories = async (
    messageId: string,
    newCalories: number
  ) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    const mealDescription = message.content.split('"')[1] || "";

    const mealData = {
      name: mealDescription,
      calories: newCalories,
      date: new Date().toISOString(),
      description: mealDescription,
      mealType: determineMealType(message.content),
      entryMethod: "text",
      originalText: mealDescription,
      nutrition: {
        protein: Math.round((newCalories * 0.3) / 4), // 30% protein
        carbs: Math.round((newCalories * 0.5) / 4), // 50% carbs
        fat: Math.round((newCalories * 0.2) / 9), // 20% fat
      },
    };

    try {
      await createMeal(mealData);

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

      toast.success("Meal calorie amount adjusted and logged!");
    } catch (error) {
      console.error("Error adjusting calories:", error);
      toast.error("Failed to adjust meal calories. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageCapture = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsImageUploading(true);

    // Add user message indicating image upload
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "📷 [Uploading a meal photo]",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send the image to the backend
      // Note: In a real implementation, this would call the uploadMealImage function

      // Simulate successful upload with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, we would process the image through the API
      const uploadResponse: Message = {
        id: Date.now().toString(),
        type: "calorie-estimate",
        content:
          "I've analyzed your meal photo and estimate it to be approximately 450 calories. Is this correct?",
        timestamp: new Date(),
        metadata: {
          calories: 450,
          confirmed: false,
        },
      };

      setMessages((prev) => [...prev, uploadResponse]);
    } catch (error) {
      console.error("Error uploading image:", error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content:
          "Sorry, there was an error processing your meal photo. Please try again or log your meal with text.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error(
        "Failed to process image. Please try again or use text entry."
      );
    } finally {
      setIsImageUploading(false);
      // Reset the file input for future uploads
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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

          {(isLoading || isImageUploading) && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
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
            disabled={isLoading || isImageUploading}
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
              disabled={isLoading || isImageUploading}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={handleSend}
              disabled={isLoading || isImageUploading || !input.trim()}
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

        {/* Hidden file input for image uploads */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
