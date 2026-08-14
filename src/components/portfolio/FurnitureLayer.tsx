import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { navItems, type ViewId } from "./data";
import { usePortfolioTheme } from "./theme-context";

export type FurnitureInteraction = {
  id: ViewId | null;
  x: number;
  y: number;
};

type FurnitureLayerProps = {
  docked: boolean;
  activeSection: ViewId;
  interaction: FurnitureInteraction;
};

type FurnitureRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type FurnitureRects = Partial<Record<ViewId, FurnitureRect>>;

const getSlotRect = (id: ViewId, docked: boolean): FurnitureRect | null => {
  const attribute = docked ? "data-furniture-target" : "data-furniture-source";
  const slots = document.querySelectorAll<HTMLElement>(`[${attribute}="${id}"]`);
  const slot = Array.from(slots).find((candidate) => {
    const rect = candidate.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  if (!slot) return null;
  const rect = slot.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

export const FurnitureLayer = ({
  docked,
  activeSection,
  interaction,
}: FurnitureLayerProps) => {
  const reducedMotion = Boolean(useReducedMotion());
  const { theme } = usePortfolioTheme();
  const isNight = theme === "dark";
  const [rects, setRects] = useState<FurnitureRects>({});

  const measure = useCallback(() => {
    setRects(
      navItems.reduce<FurnitureRects>((next, item) => {
        const rect = getSlotRect(item.id, docked);
        if (rect) next[item.id] = rect;
        return next;
      }, {}),
    );
  }, [docked]);

  useEffect(() => {
    let frame = window.requestAnimationFrame(measure);
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("resize", scheduleMeasure);
    if (!docked) {
      window.addEventListener("scroll", scheduleMeasure, { passive: true });
    }
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
    };
  }, [docked, measure]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      {navItems.map((item) => {
        const rect = rects[item.id];
        if (!rect) return null;

        const isInteracting = interaction.id === item.id;
        const isActive = docked && activeSection === item.id;
        const isIlluminated = isInteracting || isActive;
        const position = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        };

        return (
          <motion.div
            key={item.id}
            initial={position}
            animate={position}
            transition={{
              duration: reducedMotion ? 0 : 0.95,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed left-0 top-0"
          >
            <motion.img
              src={item.image}
              alt=""
              animate={{
                x: isInteracting ? interaction.x : 0,
                y: isInteracting ? interaction.y : 0,
                scaleX: !docked && item.id === "beyond" ? -1 : 1,
                opacity: isNight ? (isIlluminated ? 1 : docked ? 0.45 : 0.52) : 1,
                filter: isNight
                  ? isIlluminated
                    ? `grayscale(0) brightness(1) contrast(1)${isInteracting ? " drop-shadow(0 0 12px rgba(236, 189, 51, 0.18))" : ""}`
                    : "grayscale(1) brightness(1.4) contrast(0.7)"
                  : docked
                    ? isActive
                      ? "grayscale(0) brightness(1) contrast(1)"
                      : "grayscale(1) brightness(1.35) contrast(0.55)"
                    : isInteracting
                      ? "grayscale(0) brightness(1) contrast(1)"
                      : "grayscale(1) brightness(1.25) contrast(0.65)",
              }}
              transition={{
                x: { duration: reducedMotion ? 0 : 0.28, ease: "easeOut" },
                y: { duration: reducedMotion ? 0 : 0.28, ease: "easeOut" },
                scaleX: { duration: reducedMotion ? 0 : 0.28, ease: "easeOut" },
                filter: { duration: reducedMotion ? 0 : 0.5, ease: "easeOut" },
                opacity: { duration: reducedMotion ? 0 : 0.45, ease: "easeOut" },
              }}
              className="h-full w-full object-contain"
            />
          </motion.div>
        );
      })}
    </div>
  );
};
