"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);

  // Sign In form state
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  // Sign Up form state
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Sign In form errors
  const [signInErrors, setSignInErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // Sign Up form errors
  const [signUpErrors, setSignUpErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    setSignInErrors({
      email: "",
      password: "",
      general: "",
    });

    // Validate form
    let hasErrors = false;
    const newErrors = { ...signInErrors };

    if (!signInForm.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    }

    if (!signInForm.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setSignInErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would validate credentials with a backend
      // For demo, just redirect to home after a delay
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    setSignUpErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    // Validate form
    let hasErrors = false;
    const newErrors = { ...signUpErrors };

    if (!signUpForm.name) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }

    if (!signUpForm.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(signUpForm.email)) {
      newErrors.email = "Email is invalid";
      hasErrors = true;
    }

    if (!signUpForm.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (signUpForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      hasErrors = true;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setSignUpErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would create a new account and sign in
      // For demo, just redirect to home after a delay
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">niblet.ai</CardTitle>
          <CardDescription>
            Simplify your weight management journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "signin" | "signup")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInForm.email}
                    onChange={(e) =>
                      setSignInForm({ ...signInForm, email: e.target.value })
                    }
                  />
                  {signInErrors.email && (
                    <p className="text-sm text-red-500">{signInErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={signInForm.password}
                    onChange={(e) =>
                      setSignInForm({ ...signInForm, password: e.target.value })
                    }
                  />
                  {signInErrors.password && (
                    <p className="text-sm text-red-500">
                      {signInErrors.password}
                    </p>
                  )}
                </div>

                {signInErrors.general && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                    {signInErrors.general}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <span className="mr-2">Signing In</span>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={signUpForm.name}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, name: e.target.value })
                    }
                  />
                  {signUpErrors.name && (
                    <p className="text-sm text-red-500">{signUpErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpForm.email}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, email: e.target.value })
                    }
                  />
                  {signUpErrors.email && (
                    <p className="text-sm text-red-500">{signUpErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a password (min. 8 characters)"
                    value={signUpForm.password}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, password: e.target.value })
                    }
                  />
                  {signUpErrors.password && (
                    <p className="text-sm text-red-500">
                      {signUpErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  {signUpErrors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {signUpErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {signUpErrors.general && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                    {signUpErrors.general}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <span className="mr-2">Creating Account</span>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}
