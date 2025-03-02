// components/add-meal-dialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"], {
    required_error: "Please select a meal type.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  calories: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0;
    },
    {
      message: "Please enter a valid calorie amount.",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMealDialogProps {
  trigger?: React.ReactNode;
  onMealAdded?: (meal: FormValues) => void;
}

export function AddMealDialog({ trigger, onMealAdded }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealType: "breakfast",
      description: "",
      calories: "",
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);

      // Call the callback if provided
      if (onMealAdded) {
        onMealAdded(data);
      }

      // Close the dialog and reset the form
      setOpen(false);
      form.reset();
    }, 1000);
  }

  function handleImageCapture() {
    // In a real app, this would open a camera or file picker
    alert(
      "In a real app, this would open the camera to take a picture of your meal"
    );
  }

  // Default trigger if none provided
  const defaultTrigger = (
    <Button className="bg-black text-white hover:bg-gray-800">
      <Plus className="mr-2 h-4 w-4" /> Add Meal
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a meal</DialogTitle>
          <DialogDescription>
            Record what you ate to track your calories and nutrition.
          </DialogDescription>
        </DialogHeader>

        {/* Toggle between text and image input */}
        <div className="flex border rounded-md overflow-hidden mb-4">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              !isImageMode ? "bg-black text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setIsImageMode(false)}
          >
            Text
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              isImageMode ? "bg-black text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setIsImageMode(true)}
          >
            Photo
          </button>
        </div>

        {isImageMode ? (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleImageCapture}
            >
              <Camera className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Take a photo of your meal or
                <br />
                click to upload an image
              </p>
            </div>
            <p className="text-xs text-gray-500">
              We&apos;ll automatically detect the food and estimate calories
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mealType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Meal Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="breakfast" id="breakfast" />
                          <label
                            htmlFor="breakfast"
                            className="text-sm font-normal"
                          >
                            Breakfast
                          </label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="lunch" id="lunch" />
                          <label
                            htmlFor="lunch"
                            className="text-sm font-normal"
                          >
                            Lunch
                          </label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="dinner" id="dinner" />
                          <label
                            htmlFor="dinner"
                            className="text-sm font-normal"
                          >
                            Dinner
                          </label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="snack" id="snack" />
                          <label
                            htmlFor="snack"
                            className="text-sm font-normal"
                          >
                            Snack
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you eat?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your meal... (e.g. Turkey sandwich with lettuce and tomato, apple, water)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 450" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Now</span>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Meal"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
