import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and ensures proper Tailwind CSS merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
