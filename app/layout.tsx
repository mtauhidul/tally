import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tally - Daily Calorie Tracking Made Simple",
  description:
    "Track your calories and nutrition with a minimal, intuitive interface. Reach your health goals with Tally.",
  keywords: ["calorie tracking", "nutrition", "health app", "diet", "fitness"],
  authors: [{ name: "Tally App" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full`}
      >
        <div className="h-full bg-background text-foreground">{children}</div>
      </body>
    </html>
  );
}
