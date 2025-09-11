// src/services/Providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={["charcoal", "midnight", "obsidian", "fairytale"]}
      defaultTheme="charcoal"
    >
      {children}
    </ThemeProvider>
  );
};
