import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { usePortfolioScroll } from "@/hooks/use-portfolio-scroll";
import { CursorProvider } from "./CursorProvider";
import {
  FurnitureLayer,
  type FurnitureInteraction,
} from "./FurnitureLayer";
import { Hero } from "./Hero";
import { NavRail } from "./NavRail";
import { PortfolioSections } from "./PortfolioSections";
import { SiteHeader } from "./SiteHeader";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

export const PortfolioApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [furnitureInteraction, setFurnitureInteraction] =
    useState<FurnitureInteraction>({ id: null, x: 0, y: 0 });
  const {
    furnitureDocked,
    activeSection,
    progress,
    navigateToSection,
    scrollToHome,
  } = usePortfolioScroll(location.hash, location.pathname, navigate);

  return (
    <ThemeProvider>
      <CursorProvider>
        <div className="relative min-h-screen w-full bg-background text-foreground">
          <ThemeToggle className="fixed right-6 top-0 z-[60] h-16 md:right-10" />
        <FurnitureLayer
          docked={furnitureDocked}
          activeSection={activeSection}
          interaction={furnitureInteraction}
        />
        <Hero
          onNavigate={navigateToSection}
          onEnterAbout={() => navigateToSection("about")}
          onFurnitureInteraction={setFurnitureInteraction}
        />

        <motion.div
          initial={false}
          animate={{ opacity: furnitureDocked ? 1 : 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className={furnitureDocked ? undefined : "pointer-events-none"}
          aria-hidden={!furnitureDocked}
        >
          <SiteHeader onHome={scrollToHome} />
        </motion.div>

          <NavRail
            current={activeSection}
            progress={progress}
            visible={furnitureDocked}
            onNavigate={navigateToSection}
            onFurnitureInteraction={setFurnitureInteraction}
          />

        <PortfolioSections />
        </div>
      </CursorProvider>
    </ThemeProvider>
  );
};
