// app/onboarding/page.tsx
"use client";

import { OnboardingFlow } from "@/components/onboarding-flow";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-4 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold">Tally</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <OnboardingFlow />
      </main>

      {/* Footer */}
      <footer className="border-t py-4 px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Tally. All rights reserved.
      </footer>
    </div>
  );
}
