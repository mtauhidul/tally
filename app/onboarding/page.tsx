/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { authAPI } from "@/services/api";
import { Mic, MicOff, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  isQuestion?: boolean;
  expectedDataType?:
    | "height"
    | "weight"
    | "age"
    | "gender"
    | "goal-weight"
    | "activity"
    | "confirmation";
  expectingResponse?: boolean;
}

interface UserData {
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  goalWeight?: number;
  activityLevel?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData, setUserData] = useState<UserData>({});
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recognition for voice input
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Initialize onboarding conversation
  useEffect(() => {
    const initialMessage: Message = {
      id: "welcome",
      text: "hi there! i'm nibble, your personal nutrition assistant. let's get to know each other a bit so i can help you reach your goals!",
      sender: "assistant",
      timestamp: new Date(),
    };

    setMessages([initialMessage]);

    // After a brief pause, ask the first question
    setTimeout(() => {
      askNextQuestion("height");
    }, 1000);

    // Initialize speech recognition
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
      alert("speech recognition is not supported in your browser.");
      return;
    }
    setIsListening(!isListening);
  };

  const askNextQuestion = (type: string) => {
    let questionText = "";

    switch (type) {
      case "height":
        questionText = "what's your height in inches?";
        break;
      case "weight":
        questionText = "what's your current weight in pounds?";
        break;
      case "age":
        questionText = "how old are you?";
        break;
      case "gender":
        questionText =
          "what's your gender? this helps me calculate your calorie needs more accurately.";
        break;
      case "goal-weight":
        questionText = "what's your goal weight in pounds?";
        break;
      case "activity":
        questionText =
          "how would you describe your activity level? (sedentary, lightly active, moderately active, very active)";
        break;
      case "confirmation":
        const { height, weight, age, gender, goalWeight, activityLevel } =
          userData;
        questionText = `great! here's what i've got:\n\nheight: ${height} inches\nweight: ${weight} lbs\nage: ${age}\ngender: ${gender}\ngoal weight: ${goalWeight} lbs\nactivity level: ${activityLevel}\n\ndoes that look right to you?`;
        break;
      default:
        questionText =
          "what else would you like to tell me about your health goals?";
    }

    const question: Message = {
      id: `question-${Date.now()}`,
      text: questionText,
      sender: "assistant",
      timestamp: new Date(),
      isQuestion: true,
      expectedDataType: type as any,
      expectingResponse: true,
    };

    setMessages((prev) => [...prev, question]);
    setCurrentQuestion(question);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentQuestion) return;

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

    // Process the user's response
    if (currentQuestion.expectedDataType) {
      processUserResponse(userInput, currentQuestion.expectedDataType);
    }
  };

  const processUserResponse = (response: string, dataType: string) => {
    let nextQuestionType = "";
    let processedValue: any;

    switch (dataType) {
      case "height":
        // Extract number from response
        processedValue = extractNumber(response);
        if (processedValue) {
          setUserData((prev) => ({ ...prev, height: processedValue }));
          nextQuestionType = "weight";

          // Confirmation message
          addAssistantMessage(`got it! ${processedValue} inches tall.`);
        } else {
          // Ask again if couldn't extract a number
          addAssistantMessage(
            "i didn't catch that. please enter your height in inches (e.g., 70)."
          );
          nextQuestionType = "height";
        }
        break;

      case "weight":
        processedValue = extractNumber(response);
        if (processedValue) {
          setUserData((prev) => ({ ...prev, weight: processedValue }));
          nextQuestionType = "age";

          addAssistantMessage(`${processedValue} pounds. noted!`);
        } else {
          addAssistantMessage(
            "i need a number for your weight in pounds. please try again."
          );
          nextQuestionType = "weight";
        }
        break;

      case "age":
        processedValue = extractNumber(response);
        if (processedValue && processedValue > 0 && processedValue < 120) {
          setUserData((prev) => ({ ...prev, age: processedValue }));
          nextQuestionType = "gender";

          addAssistantMessage(`${processedValue} years old. thanks!`);
        } else {
          addAssistantMessage("please provide a valid age between 1 and 120.");
          nextQuestionType = "age";
        }
        break;

      case "gender":
        processedValue = response.toLowerCase();
        if (
          processedValue.includes("male") ||
          processedValue.includes("female") ||
          processedValue.includes("other") ||
          processedValue.includes("prefer")
        ) {
          // Extract just the basic gender for storage
          let genderValue = "other";
          if (
            processedValue.includes("male") &&
            !processedValue.includes("female")
          ) {
            genderValue = "male";
          } else if (processedValue.includes("female")) {
            genderValue = "female";
          }

          setUserData((prev) => ({ ...prev, gender: genderValue }));
          nextQuestionType = "goal-weight";

          addAssistantMessage(`thanks for sharing that.`);
        } else {
          addAssistantMessage(
            "please specify male, female, or other for your gender."
          );
          nextQuestionType = "gender";
        }
        break;

      case "goal-weight":
        processedValue = extractNumber(response);
        if (processedValue && processedValue > 0) {
          setUserData((prev) => ({ ...prev, goalWeight: processedValue }));
          nextQuestionType = "activity";

          addAssistantMessage(
            `got it! ${processedValue} pounds is your goal weight.`
          );
        } else {
          addAssistantMessage(
            "i need a number for your goal weight in pounds."
          );
          nextQuestionType = "goal-weight";
        }
        break;

      case "activity":
        processedValue = response.toLowerCase();
        let activityLevel = "moderate";

        if (
          processedValue.includes("sedentary") ||
          processedValue.includes("not active") ||
          processedValue.includes("inactive")
        ) {
          activityLevel = "sedentary";
        } else if (
          processedValue.includes("light") ||
          processedValue.includes("mild")
        ) {
          activityLevel = "light";
        } else if (
          processedValue.includes("moderate") ||
          processedValue.includes("average")
        ) {
          activityLevel = "moderate";
        } else if (
          processedValue.includes("very") ||
          processedValue.includes("high") ||
          processedValue.includes("intense")
        ) {
          activityLevel = "very-active";
        }

        setUserData((prev) => ({ ...prev, activityLevel }));
        nextQuestionType = "confirmation";

        addAssistantMessage(`${activityLevel} activity level. thanks!`);
        break;

      case "confirmation":
        if (
          response.toLowerCase().includes("yes") ||
          response.toLowerCase().includes("correct") ||
          response.toLowerCase().includes("look") ||
          response.toLowerCase().includes("right") ||
          response.toLowerCase().includes("good")
        ) {
          // User confirmed info is correct
          completeOnboarding();
        } else {
          // User wants to make corrections
          addAssistantMessage(
            "no problem! let's start again with your height."
          );
          nextQuestionType = "height";
        }
        break;
    }

    // Set current question to null momentarily to avoid duplicate responses
    setCurrentQuestion(null);

    // Ask next question with a slight delay for natural conversation flow
    if (nextQuestionType) {
      setTimeout(() => {
        askNextQuestion(nextQuestionType);
      }, 1000);
    }
  };

  const addAssistantMessage = (text: string) => {
    const message: Message = {
      id: `assistant-${Date.now()}`,
      text,
      sender: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
  };

  const extractNumber = (text: string): number | null => {
    const matches = text.match(/\d+(\.\d+)?/);
    return matches ? parseFloat(matches[0]) : null;
  };

  const completeOnboarding = async () => {
    setIsLoading(true);

    try {
      // Update user profile with the collected data
      if (user) {
        await authAPI.updateProfile({
          height: userData.height,
          weight: userData.weight,
          age: userData.age,
          gender: userData.gender,
          activityLevel: userData.activityLevel,
        });

        // Create goal if we have goal weight
        if (userData.goalWeight) {
          // Here you would typically call your goals API
          // This is a placeholder
          console.log("Setting goal weight to:", userData.goalWeight);
        }

        // Mark onboarding as complete
        await authAPI.completeOnboarding();

        // Success message
        addAssistantMessage(
          "awesome! your profile is all set up. let's start tracking your nutrition journey!"
        );

        // Redirect after a delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        throw new Error("User is not authenticated");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Error", {
        description:
          "Something went wrong with setting up your profile. Please try again.",
      });
      addAssistantMessage(
        "i'm having trouble saving your profile. can we try again?"
      );

      // Reset to the first question
      setTimeout(() => {
        askNextQuestion("height");
      }, 1000);
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-4 bg-white">
        <div className="max-w-7xl mx-auto w-full flex justify-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold">niblet.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px] flex flex-col">
                {/* Chat messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex flex-col space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div
                          className={cn(
                            "px-3 py-2 rounded-lg max-w-[85%] break-words",
                            message.sender === "user"
                              ? "bg-black text-white ml-auto"
                              : "bg-gray-100 text-black"
                          )}
                        >
                          <p className="text-sm whitespace-pre-line">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input area */}
                <div className="p-3 border-t bg-white">
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

                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isListening ? "listening..." : "type your response..."
                      }
                      className="flex-1"
                      disabled={
                        isLoading || !currentQuestion?.expectingResponse
                      }
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={handleSendMessage}
                      disabled={
                        !inputValue.trim() ||
                        isLoading ||
                        !currentQuestion?.expectingResponse
                      }
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 px-4 text-center text-xs text-gray-500 bg-white">
        &copy; {new Date().getFullYear()} niblet.ai. all rights reserved.
      </footer>
    </div>
  );
}
