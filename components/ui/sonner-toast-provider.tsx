// components/sonner-toast-provider.tsx
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SonnerToaster position="bottom-right" theme="light" richColors />
    </>
  );
}
