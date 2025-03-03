import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Camera, SendHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I can help you track your meals, estimate calories, or suggest recipes. What would you like to do today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Simulate API delay
    setTimeout(() => {
      // Generate a response based on the user message
      const response = generateResponse(userMessage.text);

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
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for meal logging intent
    if (
      lowerMessage.includes("ate") ||
      lowerMessage.includes("had") ||
      lowerMessage.includes("log")
    ) {
      if (
        lowerMessage.includes("breakfast") ||
        lowerMessage.includes("lunch") ||
        lowerMessage.includes("dinner") ||
        lowerMessage.includes("snack")
      ) {
        // Extract calories
        let calories = 0;
        if (lowerMessage.includes("eggs")) calories += 140;
        if (lowerMessage.includes("bacon")) calories += 120;
        if (lowerMessage.includes("toast")) calories += 80;
        if (lowerMessage.includes("coffee")) calories += 5;
        if (lowerMessage.includes("sandwich")) calories += 350;
        if (lowerMessage.includes("salad")) calories += 200;

        if (calories === 0) calories = 300; // Default

        return `I've logged that meal with an estimated ${calories} calories. Would you like to add any details or adjust the calorie count?`;
      }
    }

    // Check for calorie questions
    if (
      lowerMessage.includes("how many calories") ||
      lowerMessage.includes("calories in")
    ) {
      if (lowerMessage.includes("pizza"))
        return "A slice of pizza typically has about 250-300 calories.";
      if (lowerMessage.includes("apple"))
        return "A medium apple has about 95 calories.";
      if (lowerMessage.includes("burger"))
        return "A typical hamburger has about 350-550 calories.";

      return "I can help estimate calories for different foods. Could you specify what food you're asking about?";
    }

    // Check for weight updates
    if (lowerMessage.includes("weight") || lowerMessage.includes("weigh")) {
      const weightRegex = /(\d+\.?\d*)\s*(lbs|pounds|kg|kilograms)/i;
      const match = lowerMessage.match(weightRegex);

      if (match) {
        const weight = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        return `Great! I've logged your weight as ${weight} ${unit}. Keep up the good work!`;
      }
    }

    // Default responses
    return "I'm here to help with your calorie tracking and meal planning. You can ask me to log meals, estimate calories in foods, or suggest meal ideas.";
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-3">
        <ScrollArea className="h-48">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "px-3 py-2 rounded-lg max-w-[85%] break-words",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p className="text-sm">{message.text}</p>
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

        <div className="flex items-center gap-2 mt-3">
          <Button variant="outline" size="icon" className="shrink-0">
            <Camera className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your meal or question..."
            className="flex-1"
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
      </CardContent>
    </Card>
  );
}
