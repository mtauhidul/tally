/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UnifiedChart } from "@/components/unified-chart";
import { cn } from "@/lib/utils";
import {
  Camera,
  MapPin,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  SendHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function DashboardPage() {
  // Calorie tracking stats
  const dailyStats = {
    caloriesConsumed: 386,
    caloriesTarget: 1800,
    remaining: 1414,
    percentage: 21.4, // (386/1800)*100
  };

  // Chat functionality
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "what would you like to do? log a meal. ask me to estimate calories for a dish. get a recipe recommendation.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recognition for voice input
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Swipe functionality
  const [showChart, setShowChart] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Handle swipe between dashboard and chart views
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 75) {
      // Swipe left - show chart
      setShowChart(true);
    } else if (touchEndX - touchStartX > 75) {
      // Swipe right - show dashboard
      setShowChart(false);
    }
  };

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

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
      // Start voice call logic would go here
      // For now, we'll just add a message indicating a call started
      setMessages((prev) => [
        ...prev,
        {
          id: `call-${Date.now()}`,
          text: "voice conversation started. what can i help you with today?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } else {
      // End call logic
      setMessages((prev) => [
        ...prev,
        {
          id: `call-end-${Date.now()}`,
          text: "voice conversation ended. you can continue typing if you'd like.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.toLowerCase(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      // Generate a basic response based on the user message
      const response = generateSimpleResponse(userInput.toLowerCase());

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple response generator
  const generateSimpleResponse = (userMessage: string): string => {
    if (userMessage.includes("hi") || userMessage.includes("hello")) {
      return "hi there! what can i help you with today?";
    }

    if (userMessage.includes("weight")) {
      return "i've logged your weight update. you're making great progress!";
    }

    if (userMessage.includes("breakfast") || userMessage.includes("ate")) {
      return "i've logged your meal. that's about 320 calories. how did you enjoy it?";
    }

    if (userMessage.includes("recipe") || userMessage.includes("dinner")) {
      return "here's a simple dinner idea: grilled chicken with roasted vegetables. it's about 450 calories per serving.";
    }

    if (userMessage.includes("calories") || userMessage.includes("how many")) {
      return "a typical serving would be around 300-350 calories.";
    }

    return "i've made a note of that. anything else you'd like to track or ask about?";
  };

  return (
    <div
      className="flex flex-col space-y-4 pb-6 h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`transition-opacity duration-300 ${
          showChart ? "opacity-0 h-0 overflow-hidden m-0 p-0" : "opacity-100"
        }`}
      >
        {/* Calorie Progress Bar */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-bold text-green-500">
                {dailyStats.caloriesConsumed}
              </span>
              <span className="text-2xl font-bold">{dailyStats.remaining}</span>
            </div>
            <Progress
              value={dailyStats.percentage}
              className="h-6 bg-gray-100"
            />
            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
              <span>calories today</span>
              <span>calories remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-3">
            <div className="h-60 mb-3 overflow-y-auto">
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
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="bg-gray-100 text-black px-3 py-2 rounded-lg max-w-[85%] break-words">
                    <div className="flex space-x-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={toggleListening}
                disabled={isCallActive}
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
                onClick={toggleCall}
              >
                {isCallActive ? (
                  <PhoneOff className="h-5 w-5 text-red-500" />
                ) : (
                  <Phone className="h-5 w-5" />
                )}
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Camera className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <MapPin className="h-5 w-5" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening ? "listening..." : "type your meal or question..."
                }
                className="flex-1"
                disabled={isLoading || isCallActive}
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isCallActive}
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts View */}
      <div
        className={`transition-opacity duration-300 ${
          showChart ? "opacity-100" : "opacity-0 h-0 overflow-hidden m-0 p-0"
        }`}
      >
        <UnifiedChart />
      </div>

      {/* Swipe indicator */}
      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          <div
            className={`h-2 w-2 rounded-full ${
              !showChart ? "bg-black" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-2 rounded-full ${
              showChart ? "bg-black" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
