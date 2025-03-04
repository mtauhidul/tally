"use client";

import { HamburgerMenu } from "@/components/hamburger-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

type AIPersonality = "best-friend" | "professional-coach" | "tough-love";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [personality, setPersonality] = useState<AIPersonality>("best-friend");

  // Handle personality change
  const handlePersonalityChange = (newPersonality: AIPersonality) => {
    setPersonality(newPersonality);

    // Here you would typically update this in your context or state management
    // This is just a simplified example
    console.log(`Personality changed to: ${newPersonality}`);

    // You could also store this in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("niblet-personality", newPersonality);
    }
  };

  // Load saved personality on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPersonality = localStorage.getItem(
        "niblet-personality"
      ) as AIPersonality | null;
      if (savedPersonality) {
        setPersonality(savedPersonality);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center mr-auto">
            <HamburgerMenu
              onPersonalityChange={handlePersonalityChange}
              currentPersonality={personality}
            />
          </div>
          <Link href="/" className="flex items-center justify-center">
            <span className="text-xl font-bold">niblet.ai</span>
          </Link>
          <div className="ml-auto w-14"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="container h-full py-4 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
