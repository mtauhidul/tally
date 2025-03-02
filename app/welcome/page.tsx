// app/welcome/page.tsx
"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function WelcomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Simulate loading to create a smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Redirect to dashboard after setup is complete
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (progress === 100) {
      timeout = setTimeout(() => {
        // Allow the progress bar to finish before redirecting
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [progress, router]);

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
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Tally!</CardTitle>
            <CardDescription>
              Your account is ready to help you reach your goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Account Setup</span>
                <span>{progress}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">
                Your daily calorie goal has been set to:
              </p>
              <p className="text-3xl font-bold">1,850 calories</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-center">
                We&apos;ve set up your profile based on your goals. You can
                start tracking your meals and weight right away.
              </p>

              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Tally. All rights reserved.
      </footer>
    </div>
  );
}
