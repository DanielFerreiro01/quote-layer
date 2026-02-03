"use client";

import { ReactNode } from "react";
import { Dumbbell, Moon, Sun } from "lucide-react";
import { Button } from '@/components/ui/button'
import { useTheme } from "next-themes";

interface WidgetHeaderProps {
  title: string;
  accent: string;
  icon: ReactNode;
}

export function WidgetHeader({ title, accent, icon }: WidgetHeaderProps) {

  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
                { icon }
              </div>
              <span className="text-lg font-semibold text-foreground">
                { title }
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </div>
      </header>
  );
}
