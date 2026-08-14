import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePortfolioTheme } from "./theme-context";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = usePortfolioTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      data-cursor="text-link"
      className={cn(
        "group flex items-center gap-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Moon
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn(
          "h-3.5 w-3.5 transition-colors duration-300",
          isDark ? "text-foreground" : "text-muted-foreground/55",
        )}
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 rounded-full border border-border bg-secondary/55 transition-colors duration-300 ease-out group-hover:border-foreground/30"
      >
        <span
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-foreground/20 bg-foreground transition-[left] duration-300 ease-out",
            isDark ? "left-1" : "left-6",
          )}
        />
      </span>
      <Sun
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn(
          "h-3.5 w-3.5 transition-colors duration-300",
          isDark ? "text-muted-foreground/55" : "text-foreground",
        )}
      />
    </button>
  );
};
