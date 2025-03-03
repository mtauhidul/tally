// app/page.tsx
import NibletLogo from "@/components/niblet-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <NibletLogo height={32} />
          </Link>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l">
                <SheetHeader className="text-left">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate to different sections of the app
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-lg font-medium px-4 py-2 rounded-md hover:bg-muted transition-colors"
                  >
                    Log in
                  </Link>

                  <Link href="/register" className="px-4">
                    <Button className="w-full" size="lg">
                      Register
                    </Button>
                  </Link>
                </div>

                <div className="absolute bottom-4 left-4 right-4 border-t pt-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <Link
                      href="/privacy"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/terms"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms
                    </Link>
                    <Link
                      href="/contact"
                      className="hover:text-foreground transition-colors"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/login">
              <Button variant="ghost" size="lg">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg">Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-12 lg:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Desktop layout: two columns */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
            {/* Left column: Text content on desktop */}
            <div className="flex flex-col gap-8 max-w-xl">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                  Track calories.
                  <br />
                  <span className="text-primary">Reach your goals.</span>
                </h1>
                <p className="text-slate-500 text-lg sm:text-xl max-w-md">
                  The simplest way to track your daily calories and nutrition
                  with an intuitive, minimal interface.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base px-8"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right column: Image on desktop */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-xl border overflow-hidden">
                <Image
                  src="/home_bg.jpg"
                  alt="Food tracker"
                  fill
                  sizes="(max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Mobile layout: custom ordering of elements */}
          <div className="flex flex-col lg:hidden">
            {/* 1. Headline on mobile */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight">
                Track calories.
                <br />
                <span className="text-primary">Reach your goals.</span>
              </h1>
            </div>

            {/* 2. Image on mobile - after headline */}
            <div className="mb-6">
              <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-xl border overflow-hidden">
                <Image
                  src="/home_bg.jpg"
                  alt="Food tracker"
                  fill
                  sizes="90vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
              </div>
            </div>

            {/* 3. Description text on mobile - after image */}
            <div className="mb-8">
              <p className="text-slate-500 text-lg max-w-md">
                The simplest way to track your daily calories and nutrition with
                an intuitive, minimal interface.
              </p>
            </div>

            {/* 4. Buttons on mobile - after description */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full text-base">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-base"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 md:px-6 mt-auto">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Niblet.ai. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
