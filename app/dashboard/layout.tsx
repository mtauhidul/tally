"use client";

import { History, Home, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: <History className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }

      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
            <Link href="/dashboard" className="text-2xl font-bold">
              Tally
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3">
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Button
              variant="outline"
              className="flex items-center w-full"
              onClick={() => console.log("Logout")}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar with Sheet component */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <Link
                href="/dashboard"
                className="text-2xl font-bold"
                onClick={() => setIsOpen(false)}
              >
                Tally
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="space-y-1 px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Button
                variant="outline"
                className="flex items-center w-full"
                onClick={() => {
                  console.log("Logout");
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="md:hidden py-4 px-4 sm:px-6 lg:px-8 h-16 border-b bg-white flex items-center">
          <h1 className="text-xl font-bold">Tally</h1>
        </div>
        <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
