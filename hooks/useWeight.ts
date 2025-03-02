// hooks/useWeight.ts
import { weightAPI } from "@/services/api";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  unit?: string;
  notes?: string;
}

export interface WeightStats {
  current: number;
  starting: number;
  lowest: number;
  highest: number;
  totalEntries: number;
  firstDate: string;
  lastDate: string;
  netChange: number;
}

export interface GoalData {
  current: number | null;
  target: number;
  targetDate: string;
  progress: number;
  projectedCompletionDate?: string;
}

export function useWeight() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [weightStats, setWeightStats] = useState<WeightStats | null>(null);
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get weight entries
  const getWeightEntries = useCallback(
    async (startDate?: string, endDate?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await weightAPI.getWeightEntries(startDate, endDate);
        setWeightEntries(response.data.data);
        if (response.data.stats) {
          setWeightStats(response.data.stats);
        }
        if (response.data.goal) {
          setGoalData(response.data.goal);
        }
        return response.data;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        console.error("Error fetching weight entries:", err);
        setError(
          error.response?.data?.error || "Failed to fetch weight entries"
        );
        toast.error("Failed to fetch weight data. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create a new weight entry
  const createWeightEntry = useCallback(
    async (weightData: {
      weight: number;
      date?: string;
      unit?: string;
      notes?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await weightAPI.createWeightEntry(weightData);
        setWeightEntries((prevEntries) => [...prevEntries, response.data.data]);
        toast.success("Weight entry added successfully!");

        // Refresh weight entries to get updated stats
        await getWeightEntries();

        return response.data.data;
      } catch (err: unknown) {
        console.error("Error creating weight entry:", err);
        const error = err as { response?: { data?: { error?: string } } };
        setError(
          error.response?.data?.error || "Failed to create weight entry"
        );
        toast.error(
          error.response?.data?.error ||
            "Failed to add weight entry. Please try again."
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getWeightEntries]
  );

  // Update an existing weight entry
  const updateWeightEntry = useCallback(
    async (
      id: string,
      weightData: {
        weight?: number;
        date?: string;
        unit?: string;
        notes?: string;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await weightAPI.updateWeightEntry(id, weightData);
        setWeightEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === id ? response.data.data : entry
          )
        );
        toast.success("Weight entry updated successfully!");

        // Refresh weight entries to get updated stats
        await getWeightEntries();

        return response.data.data;
      } catch (err: unknown) {
        console.error("Error updating weight entry:", err);
        const error = err as { response?: { data?: { error?: string } } };
        setError(
          error.response?.data?.error || "Failed to update weight entry"
        );
        toast.error("Failed to update weight entry. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getWeightEntries]
  );

  // Delete a weight entry
  const deleteWeightEntry = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await weightAPI.deleteWeightEntry(id);
        setWeightEntries((prevEntries) =>
          prevEntries.filter((entry) => entry._id !== id)
        );
        toast.success("Weight entry deleted successfully!");

        // Refresh weight entries to get updated stats
        await getWeightEntries();

        return true;
      } catch (err: unknown) {
        console.error("Error deleting weight entry:", err);
        const error = err as { response?: { data?: { error?: string } } };
        setError(
          error.response?.data?.error || "Failed to delete weight entry"
        );
        toast.error("Failed to delete weight entry. Please try again.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getWeightEntries]
  );

  // Get weight progress
  const getWeightProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await weightAPI.getWeightProgress();
      if (response.data.stats) {
        setWeightStats(response.data.stats);
      }
      if (response.data.goal) {
        setGoalData(response.data.goal);
      }
      return response.data;
    } catch (err: unknown) {
      console.error("Error fetching weight progress:", err);
      const error = err as { response?: { data?: { error?: string } } };
      setError(
        error.response?.data?.error || "Failed to fetch weight progress"
      );
      toast.error("Failed to fetch weight progress. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Analyze weight from text (for chat interface)
  const analyzeWeightFromText = (text: string): number | null => {
    // Simple regex to extract weight value from text
    const weightRegex = /(\d+\.?\d*)\s*(lbs?|pounds?|kg|kilograms?)/i;
    const match = text.match(weightRegex);

    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();

      // Convert to pounds if necessary
      if (unit.startsWith("kg")) {
        return Math.round(value * 2.20462 * 10) / 10; // Convert kg to lbs with 1 decimal place
      }

      return value;
    }

    return null;
  };

  return {
    weightEntries,
    weightStats,
    goalData,
    loading,
    error,
    getWeightEntries,
    createWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    getWeightProgress,
    analyzeWeightFromText,
  };
}
