/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ai-assistant.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Camera,
  MapPin,
  Mic,
  MicOff,
  SendHorizontal,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  showRating?: boolean;
  rated?: boolean;
}

type AIPersonality = "best-friend" | "professional-coach" | "tough-love";

// Use a single assistant ID from environment variables
const ASSISTANT_ID =
  process.env.NEXT_PUBLIC_ASSISTANT_ID || "your_assistant_id_here";

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<AIPersonality>("best-friend");
  const [isListening, setIsListening] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Setup SpeechRecognition - safely check if it's available in browser
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        setRecognitionInstance(recognition);
      }
    }
  }, []);

  // Create a new thread when component mounts
  useEffect(() => {
    async function createThread() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/assistants/thread", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create thread");
        }

        const data = await response.json();
        setThreadId(data.threadId);

        // After creating thread, set welcome message based on personality
        sendPersonalityMessage();
      } catch (error) {
        console.error("Error creating thread:", error);
      } finally {
        setIsLoading(false);
      }
    }

    createThread();
  }, []);

  // Function to send the personality instruction as a message
  const sendPersonalityMessage = async () => {
    if (!threadId) return;

    // Prepare welcome message based on personality
    let welcomeMessage = "";
    switch (personality) {
      case "best-friend":
        welcomeMessage =
          "Hey there! 👋 Ready to track some meals? I'm like your BFF who happens to be super into nutrition. What have you eaten today?";
        break;
      case "professional-coach":
        welcomeMessage =
          "Welcome to niblet.ai. I'll help you reach your goals through data-driven insights and evidence-based recommendations. What would you like to log today?";
        break;
      case "tough-love":
        welcomeMessage =
          "Let's cut to the chase. Your goal is 195 lbs, and you're currently at 212. What did you eat today? Be honest - I'll know if you're not.";
        break;
    }

    // Set temporary welcome message
    setMessages([
      {
        id: "welcome",
        text: welcomeMessage,
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);

    try {
      // Send a "hidden" message to set personality
      await fetch("/api/assistants/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          assistantId: ASSISTANT_ID,
          message: `[Initialize as ${personality} personality]`,
        }),
      });
    } catch (error) {
      console.error("Error setting personality:", error);
    }
  };

  // Update when personality changes
  useEffect(() => {
    // Create new thread when personality changes
    async function switchPersonality() {
      if (!threadId) return; // Don't run on first load

      try {
        setIsLoading(true);
        const response = await fetch("/api/assistants/thread", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create new thread for personality change");
        }

        const data = await response.json();
        setThreadId(data.threadId);

        // Send personality message
        await sendPersonalityMessage();
      } catch (error) {
        console.error("Error switching personality:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only run if we already have a threadId (not on initial load)
    if (threadId) {
      switchPersonality();
    }
  }, [personality]);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle speech recognition
  useEffect(() => {
    if (!recognitionInstance) return;

    if (isListening) {
      try {
        recognitionInstance.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript;
              setInputValue((prev) => prev + transcript + " ");
            }
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionInstance.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    } else {
      try {
        recognitionInstance.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }

    return () => {
      if (isListening && recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (error) {
          console.error("Error stopping speech recognition in cleanup:", error);
        }
      }
    };
  }, [isListening, recognitionInstance]);

  const toggleListening = () => {
    if (!recognitionInstance) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    setIsListening(!isListening);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !threadId) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to OpenAI Assistant API
      const response = await fetch("/api/assistants/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          assistantId: ASSISTANT_ID,
          message: userInput,
          personality: personality,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API call failed with status: ${response.status}`
        );
      }

      const data = await response.json();

      // Check for meal logging to see if we should show rating
      const shouldShowRating = checkForMealRating(userInput, data.message);

      // Add assistant response
      const assistantMessage: Message = {
        id: data.messageId || `assistant-${Date.now()}`,
        text: data.message,
        sender: "assistant",
        timestamp: new Date(),
        showRating: shouldShowRating,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message to assistant:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text:
          error.message ||
          "Sorry, I'm having trouble connecting. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to check if the response should show a meal rating
  const checkForMealRating = (
    userInput: string,
    aiResponse: string
  ): boolean => {
    const userInputLower = userInput.toLowerCase();
    const aiResponseLower = aiResponse.toLowerCase();

    // Check if user message looks like a meal log
    const mealKeywords = [
      "ate",
      "had",
      "food",
      "meal",
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "calorie",
    ];
    const isMealLog = mealKeywords.some((keyword) =>
      userInputLower.includes(keyword)
    );

    // Check if AI is asking for a rating or mentioning calories
    const ratingIndicators = [
      "how was it?",
      "rate this",
      "rate the meal",
      "calories",
      "logged",
      "estimated calories",
      "estimated calorie",
      "total calories",
    ];
    const isAskingForRating = ratingIndicators.some((indicator) =>
      aiResponseLower.includes(indicator)
    );

    return isMealLog && isAskingForRating;
  };

  const handleRateMeal = async (
    messageId: string,
    rating: 1 | 2 | 3 | 4 | 5
  ) => {
    if (!threadId) return;

    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              rated: true,
              text: msg.text + ` (Rated: ${rating} stars)`,
            }
          : msg
      )
    );

    // Create a user message with the rating
    const ratingMessage: Message = {
      id: `rating-${Date.now()}`,
      text: `I rate this meal ${rating} stars.`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, ratingMessage]);
    setIsLoading(true);

    // Send rating to Assistant API
    try {
      const response = await fetch("/api/assistants/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          assistantId: ASSISTANT_ID,
          message: `I rate this meal ${rating} stars.`,
          personality: personality,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API call failed with status: ${response.status}`
        );
      }

      const data = await response.json();

      // Add assistant response
      const feedbackMessage: Message = {
        id: data.messageId || `feedback-${Date.now()}`,
        text: data.message,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, feedbackMessage]);
    } catch (error: any) {
      console.error("Error sending rating to assistant:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Thanks for your rating!",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">AI Assistant</h3>
          <Select
            value={personality}
            onValueChange={(value: AIPersonality) => setPersonality(value)}
          >
            <SelectTrigger className="w-[140px] h-7 text-xs">
              <SelectValue placeholder="Personality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-friend">Best Friend</SelectItem>
              <SelectItem value="professional-coach">
                Professional Coach
              </SelectItem>
              <SelectItem value="tough-love">Tough Love</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-60 mb-3">
          <div className="flex flex-col space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg max-w-[85%] break-words",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>

                {/* Meal rating component */}
                {message.sender === "assistant" &&
                  message.showRating &&
                  !message.rated && (
                    <div className="pl-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        How was this meal?
                      </p>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() =>
                              handleRateMeal(
                                message.id,
                                rating as 1 | 2 | 3 | 4 | 5
                              )
                            }
                            className="text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={toggleListening}
            disabled={isLoading}
          >
            {isListening ? (
              <MicOff className="h-5 w-5 text-red-500" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            disabled={isLoading}
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            disabled={isLoading}
          >
            <MapPin className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening ? "Listening..." : "Type your meal or question..."
            }
            className="flex-1"
            disabled={!threadId || isLoading}
          />
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !threadId}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
