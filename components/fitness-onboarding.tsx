/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
// components/fitness-onboarding.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle,
  Mic,
  MicOff,
  SendHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ActivityData {
  frequency?: string;
  duration?: string;
  intensity?: string;
  type?: string;
  zone?: string;
  description?: string;
}

export function FitnessOnboarding({
  onComplete,
}: {
  onComplete: (data: ActivityData) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock SpeechRecognition if not available in browser
  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const recognition = useMemo(
    () => (SpeechRecognition ? new SpeechRecognition() : null),
    [SpeechRecognition]
  );

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
  }

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        text: "Let's talk about your exercise habits. Tell me about what physical activities you do in a typical week.",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    setCurrentStep(1);
  }, []);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle speech recognition
  useEffect(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.start();

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            setInputValue(inputValue + transcript + " ");
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    } else {
      recognition.stop();
    }

    return () => {
      if (isListening && recognition) {
        recognition.stop();
      }
    };
  }, [isListening, inputValue, recognition]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    setIsListening(!isListening);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Process the user's message based on the current step
    processUserResponse(userMessage.text, currentStep);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const processUserResponse = (text: string, step: number) => {
    // Simple logic to extract information from the user's response
    const lowerText = text.toLowerCase();

    switch (step) {
      case 1: // Initial description of exercise habits
        let nextQuestion = "";
        let activityType = "";

        // Try to detect the type of activity
        if (
          lowerText.includes("walk") ||
          lowerText.includes("walking") ||
          lowerText.includes("hike") ||
          lowerText.includes("hiking")
        ) {
          activityType = "walking/hiking";
          setActivityData((prev) => ({ ...prev, type: activityType }));
          nextQuestion =
            "Great! How long do you typically walk/hike for in a session?";
        } else if (
          lowerText.includes("run") ||
          lowerText.includes("running") ||
          lowerText.includes("jog") ||
          lowerText.includes("jogging")
        ) {
          activityType = "running";
          setActivityData((prev) => ({ ...prev, type: activityType }));
          nextQuestion =
            "Excellent! How long do you typically run for in a session?";
        } else if (
          lowerText.includes("gym") ||
          lowerText.includes("weight") ||
          lowerText.includes("lift") ||
          lowerText.includes("strength")
        ) {
          activityType = "strength training";
          setActivityData((prev) => ({ ...prev, type: activityType }));
          nextQuestion =
            "Great choice! How many days per week do you typically do strength training?";
        } else if (
          lowerText.includes("swim") ||
          lowerText.includes("swimming")
        ) {
          activityType = "swimming";
          setActivityData((prev) => ({ ...prev, type: activityType }));
          nextQuestion =
            "Swimming is excellent exercise! How long do you typically swim for?";
        } else if (
          lowerText.includes("yoga") ||
          lowerText.includes("pilates") ||
          lowerText.includes("stretch")
        ) {
          activityType = "yoga/pilates";
          setActivityData((prev) => ({ ...prev, type: activityType }));
          nextQuestion =
            "Yoga and pilates are great for flexibility and core strength! How many times per week do you practice?";
        } else if (
          lowerText.includes("bike") ||
          lowerText.includes("cycling") ||
          lowerText.includes("bicycle")
        ) {
          activityType = "cycling";
          setActivityData((prev) => ({ ...prev, type: activityType }));
          nextQuestion =
            "Cycling is great cardio! How long do you typically ride for?";
        } else if (
          lowerText.includes("none") ||
          lowerText.includes("don't exercise") ||
          lowerText.includes("do not exercise") ||
          lowerText.includes("sedentary")
        ) {
          activityType = "sedentary";
          setActivityData((prev) => ({
            ...prev,
            type: activityType,
            intensity: "low",
            frequency: "rarely",
            duration: "none",
          }));
          nextQuestion =
            "That's okay! Everyone starts somewhere. Would you be interested in some beginner-friendly activity recommendations?";
        } else {
          // If we can't determine the activity type, ask more generally
          activityType = "general activity";
          setActivityData((prev) => ({
            ...prev,
            description: text,
            type: activityType,
          }));
          nextQuestion = "How many days per week do you typically exercise?";
        }

        // Store initial description
        setActivityData((prev) => ({ ...prev, description: text }));

        // Send assistant response
        setTimeout(() => {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            text: nextQuestion,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setCurrentStep(2);
          setIsLoading(false);
        }, 1000);
        break;

      case 2: // Duration or frequency question
        // Try to extract duration/frequency
        let durationOrFrequency = "";
        let nextPrompt = "";

        // Try to parse numbers for frequency
        const numberMatch = lowerText.match(/\d+/);

        if (
          numberMatch &&
          (lowerText.includes("time") ||
            lowerText.includes("day") ||
            lowerText.includes("week") ||
            lowerText.includes("session"))
        ) {
          const num = parseInt(numberMatch[0]);

          if (lowerText.includes("day") || lowerText.includes("week")) {
            durationOrFrequency = `${num} days per week`;
            setActivityData((prev) => ({
              ...prev,
              frequency: durationOrFrequency,
            }));
          } else {
            durationOrFrequency = `${num} sessions`;
            setActivityData((prev) => ({
              ...prev,
              frequency: durationOrFrequency,
            }));
          }
        } else if (
          lowerText.includes("minute") ||
          lowerText.includes("hour") ||
          lowerText.includes("min")
        ) {
          const minutesMatch = lowerText.match(/(\d+)\s*(?:minute|min)/i);
          const hoursMatch = lowerText.match(/(\d+)\s*(?:hour|hr)/i);

          if (minutesMatch) {
            durationOrFrequency = `${minutesMatch[1]} minutes`;
          }

          if (hoursMatch) {
            durationOrFrequency =
              hoursMatch[1] +
              " hours" +
              (minutesMatch ? " " + minutesMatch[1] + " minutes" : "");
          }

          setActivityData((prev) => ({
            ...prev,
            duration: durationOrFrequency,
          }));
        } else {
          // If we can't parse a specific duration/frequency
          durationOrFrequency = text;
          setActivityData((prev) => ({
            ...prev,
            duration: activityData.duration || text,
            frequency: activityData.frequency || text,
          }));
        }

        // Next question about intensity
        nextPrompt =
          "How would you describe the intensity of your workouts? (Light, moderate, vigorous)";

        setTimeout(() => {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            text: nextPrompt,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setCurrentStep(3);
          setIsLoading(false);
        }, 1000);
        break;

      case 3: // Intensity question
        let intensity = "";

        if (
          lowerText.includes("light") ||
          lowerText.includes("easy") ||
          lowerText.includes("low")
        ) {
          intensity = "light";
        } else if (
          lowerText.includes("moderate") ||
          lowerText.includes("medium")
        ) {
          intensity = "moderate";
        } else if (
          lowerText.includes("vigorous") ||
          lowerText.includes("intense") ||
          lowerText.includes("hard") ||
          lowerText.includes("high")
        ) {
          intensity = "vigorous";
        } else {
          intensity = text;
        }

        setActivityData((prev) => ({ ...prev, intensity }));

        // Final question about heart rate zones
        const zoneQuestion =
          "Do you monitor your heart rate during exercise or train in specific heart rate zones? (e.g., Zone 2 for fat burning, Zone 4 for high intensity)";

        setTimeout(() => {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            text: zoneQuestion,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setCurrentStep(4);
          setIsLoading(false);
        }, 1000);
        break;

      case 4: // Heart rate zone question
        const zoneInfo = text;

        setActivityData((prev) => ({ ...prev, zone: zoneInfo }));

        // Summary and confirmation
        const activitySummary = summarizeActivity();

        setTimeout(() => {
          const summaryMessage: Message = {
            id: `summary-${Date.now()}`,
            text: `Great! Here's a summary of your activity level:\n\n${activitySummary}\n\nIs this information correct?`,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, summaryMessage]);
          setCurrentStep(5);
          setIsLoading(false);
        }, 1000);
        break;

      case 5: // Confirmation
        if (
          lowerText.includes("yes") ||
          lowerText.includes("correct") ||
          lowerText.includes("right") ||
          lowerText.includes("good") ||
          lowerText.includes("confirm")
        ) {
          // User confirmed the activity summary
          setTimeout(() => {
            const completionMessage: Message = {
              id: `completion-${Date.now()}`,
              text: "Perfect! I've saved your fitness profile. This will help us tailor your nutrition recommendations to match your activity level.",
              sender: "assistant",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, completionMessage]);
            setIsComplete(true);
            setIsLoading(false);

            // Pass the completed data back
            onComplete(activityData);
          }, 1000);
        } else {
          // User wants to make corrections
          setTimeout(() => {
            const editMessage: Message = {
              id: `edit-${Date.now()}`,
              text: "No problem! Let's update your activity information. What would you like to correct?",
              sender: "assistant",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, editMessage]);
            setCurrentStep(1); // Go back to start of questioning
            setIsLoading(false);
          }, 1000);
        }
        break;

      default:
        setIsLoading(false);
        break;
    }
  };

  const summarizeActivity = (): string => {
    const { type, frequency, duration, intensity, zone } = activityData;

    let summary = "";

    if (type) {
      summary += `Activity type: ${type}\n`;
    }

    if (frequency) {
      summary += `Frequency: ${frequency}\n`;
    }

    if (duration) {
      summary += `Duration: ${duration}\n`;
    }

    if (intensity) {
      summary += `Intensity: ${intensity}\n`;
    }

    if (
      zone &&
      zone.toLowerCase() !== "no" &&
      !zone.toLowerCase().includes("don't")
    ) {
      summary += `Heart rate monitoring: ${zone}`;
    } else {
      summary += "Heart rate monitoring: Not currently tracking";
    }

    return summary;
  };

  return (
    <Card className="border shadow-md max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Activity Level Assessment</CardTitle>
        <CardDescription>
          Tell us about your exercise habits to help us personalize your
          nutrition plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] mb-4 pr-4">
          <div className="flex flex-col space-y-3">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg max-w-[85%] break-words",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg max-w-[85%] break-words">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {isComplete ? (
          <div className="flex flex-col items-center py-2">
            <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-center text-sm text-gray-600 mb-3">
              Your fitness profile has been saved successfully.
            </p>
            <Button className="bg-black text-white hover:bg-gray-800">
              Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={toggleListening}
            >
              {isListening ? (
                <MicOff className="h-5 w-5 text-red-500" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening ? "Listening..." : "Type your response..."
              }
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
