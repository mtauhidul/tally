"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BarChart2,
  Download,
  Info,
  LogOut,
  Menu,
  Settings,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AIPersonality = "best-friend" | "professional-coach" | "tough-love";

interface HamburgerMenuProps {
  onPersonalityChange?: (personality: AIPersonality) => void;
  currentPersonality?: AIPersonality;
}

export function HamburgerMenu({
  onPersonalityChange,
  currentPersonality = "best-friend",
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [personality, setPersonality] =
    useState<AIPersonality>(currentPersonality);

  const handlePersonalityChange = (value: AIPersonality) => {
    setPersonality(value);
    if (onPersonalityChange) {
      onPersonalityChange(value);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 border-r">
        <div className="flex flex-col h-full">
          <SheetHeader className="text-left p-4 border-b">
            <SheetTitle className="text-xl font-bold">niblet.ai</SheetTitle>
            <SheetDescription>your personal nutrition coach</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-4">
            <div className="space-y-1 px-3 mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase">
                personality
              </p>
              <Select
                value={personality}
                onValueChange={(value: AIPersonality) =>
                  handlePersonalityChange(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="select personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best-friend">best friend</SelectItem>
                  <SelectItem value="professional-coach">
                    professional coach
                  </SelectItem>
                  <SelectItem value="tough-love">tough love</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 px-3">
              <SheetClose asChild>
                <Link
                  href="/dashboard/goals"
                  className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Target className="mr-2 h-4 w-4" />
                  goals
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/dashboard/export"
                  className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  export
                </Link>
              </SheetClose>

              <div className="py-2">
                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    information
                  </p>
                </div>

                <SheetClose asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" />
                    profile
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/dashboard/goals"
                    className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    goals
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/dashboard/preferences"
                    className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    preferences
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/dashboard/account"
                    className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    account
                  </Link>
                </SheetClose>
              </div>
            </div>
          </div>

          <div className="border-t p-4">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => console.log("Logout")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                log out
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
