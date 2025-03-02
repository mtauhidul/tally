// hooks/useMeals.ts
import { mealsAPI } from "@/services/api";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface Meal {
  _id: string;
  description: string;
  calories: number;
  mealType: string;
  date: Date | string;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
  };
  entryMethod?: string;
  originalText?: string;
  image?: {
    url: string;
    publicId: string;
  };
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get meals for a specific date
  const getMeals = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mealsAPI.getMeals(date);
      setMeals(response.data.data);
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      console.error("Error fetching meals:", err);
      setError(error.response?.data?.error || "Failed to fetch meals");
      toast.error("Failed to fetch meals. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new meal
  const createMeal = useCallback(
    async (mealData: { name: string; calories: number; date: string }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await mealsAPI.createMeal(mealData);
        setMeals((prevMeals) => [...prevMeals, response.data.data]);
        toast.success("Meal added successfully!");
        return response.data.data;
      } catch (err: unknown) {
        console.error("Error creating meal:", err);
        const error = err as { response?: { data?: { error?: string } } };
        setError(error.response?.data?.error || "Failed to create meal");
        toast.error("Failed to add meal. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update an existing meal
  const updateMeal = useCallback(
    async (
      id: string,
      mealData: Partial<Omit<Meal, "date">> & { date?: string }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await mealsAPI.updateMeal(id, mealData);
        setMeals((prevMeals) =>
          prevMeals.map((meal) => (meal._id === id ? response.data.data : meal))
        );
        toast.success("Meal updated successfully!");
        return response.data.data;
      } catch (err: unknown) {
        console.error("Error updating meal:", err);
        const error = err as { response?: { data?: { error?: string } } };
        setError(error.response?.data?.error || "Failed to update meal");
        toast.error("Failed to update meal. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a meal
  const deleteMeal = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await mealsAPI.deleteMeal(id);
      setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== id));
      toast.success("Meal deleted successfully!");
      return true;
    } catch (err: unknown) {
      console.error("Error deleting meal:", err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to delete meal");
      toast.error("Failed to delete meal. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Analyze meal text
  const analyzeMealText = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mealsAPI.analyzeMealText(text);
      return response.data.data;
    } catch (err: unknown) {
      console.error("Error analyzing meal text:", err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to analyze meal text");
      toast.error(
        "Failed to analyze meal text. Please try again or enter details manually."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload meal image
  const uploadMealImage = useCallback(async (image: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mealsAPI.uploadMealImage(image);
      setMeals((prevMeals) => [...prevMeals, response.data.data]);
      toast.success("Meal image processed and added successfully!");
      return response.data.data;
    } catch (err: unknown) {
      console.error("Error uploading meal image:", err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to upload meal image");
      toast.error(
        "Failed to process meal image. Please try again or enter details manually."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get meal summary
  const getMealSummary = useCallback(
    async (startDate?: string, endDate?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await mealsAPI.getMealSummary(startDate, endDate);
        return response.data;
      } catch (err: unknown) {
        console.error("Error fetching meal summary:", err);
        const error = err as { response?: { data?: { error?: string } } };
        setError(error.response?.data?.error || "Failed to fetch meal summary");
        toast.error("Failed to fetch meal summary. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    meals,
    loading,
    error,
    getMeals,
    createMeal,
    updateMeal,
    deleteMeal,
    analyzeMealText,
    uploadMealImage,
    getMealSummary,
  };
}
