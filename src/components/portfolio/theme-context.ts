import { createContext, useContext } from "react";

export type PortfolioTheme = "light" | "dark";

type ThemeContextValue = {
  theme: PortfolioTheme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => undefined,
});

export const usePortfolioTheme = () => useContext(ThemeContext);
