// app/register/actions.ts
"use server";

import { redirect } from "next/navigation";

export async function registerUser() {
  // In a real app, here you would:
  // 1. Validate the input
  // 2. Hash the password
  // 3. Create the user in the database
  // 4. Set up an authentication session

  // For now, we'll just redirect to the onboarding flow
  redirect("/onboarding");
}
