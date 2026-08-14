import { useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { CursorContext } from "./cursor-context";
import { usePortfolioTheme } from "./theme-context";

export type CursorMode =
  | "default"
  | "hero-about"
  | "hero-work"
  | "hero-beyond"
  | "text-link";

const MODE_STYLES: Record<
  CursorMode,
  { size: number; ring: string; dot: string }
> = {
  default: { size: 30, ring: "#014A99", dot: "#111111" },
  "hero-about": { size: 58, ring: "#014A99", dot: "#ECBD33" },
  "hero-work": { size: 58, ring: "#C65324", dot: "#111111" },
  "hero-beyond": { size: 58, ring: "#014A99", dot: "#ECBD33" },
  "text-link": { size: 18, ring: "#014A99", dot: "#111111" },
};

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest("input, textarea, select, [contenteditable='true']"));

const modeFromTarget = (target: EventTarget | null): CursorMode => {
  if (!(target instanceof Element)) return "default";
  const value = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  return value && value in MODE_STYLES ? (value as CursorMode) : "default";
};

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { theme } = usePortfolioTheme();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const springX = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.5 });
  const ringX = prefersReducedMotion ? pointerX : springX;
  const ringY = prefersReducedMotion ? pointerY : springY;
  const baseAppearance = MODE_STYLES[mode];
  const appearance = theme === "dark" && mode === "default"
    ? {
        ...baseAppearance,
        ring: "hsl(var(--muted-foreground))",
        dot: "hsl(var(--foreground))",
      }
    : baseAppearance;

  useMotionValueEvent(ringX, "change", (value) => {
    document.documentElement.style.setProperty("--cursor-x", `${value}px`);
  });
  useMotionValueEvent(ringY, "change", (value) => {
    document.documentElement.style.setProperty("--cursor-y", `${value}px`);
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--cursor-radius",
      `${appearance.size / 2}px`,
    );
  }, [appearance.size]);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor-active", enabled);
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(!isEditableTarget(event.target));
      if (!isEditableTarget(event.target)) setMode(modeFromTarget(event.target));
    };
    const onPointerOver = (event: PointerEvent) => {
      if (isEditableTarget(event.target)) {
        setVisible(false);
        return;
      }
      setVisible(true);
      setMode(modeFromTarget(event.target));
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        setVisible(false);
        return;
      }
      if (isEditableTarget(event.relatedTarget)) {
        setVisible(false);
        return;
      }
      setMode(modeFromTarget(event.relatedTarget));
    };
    const onPointerDown = () => setPressed(true);
    const onPointerUp = () => setPressed(false);
    const onBlur = () => {
      setVisible(false);
      setPressed(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled, pointerX, pointerY]);

  return (
    <CursorContext.Provider
      value={{ enabled, reducedMotion: prefersReducedMotion }}
    >
      {children}
      {enabled && (
        <>
          <motion.div
            aria-hidden="true"
            className="custom-cursor-layer fixed left-0 top-0 z-[100] h-0 w-0"
            style={{ x: ringX, y: ringY }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.span
              className="absolute left-0 top-0 block border bg-transparent"
              transformTemplate={(_, generatedTransform) =>
                `translate(-50%, -50%) ${generatedTransform}`
              }
              animate={{
                width: appearance.size,
                height: appearance.size,
                borderColor: appearance.ring,
                scale: pressed ? 0.85 : 1,
              }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ borderRadius: "48% 52% 51% 49% / 52% 47% 53% 48%" }}
            />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="custom-cursor-layer fixed left-0 top-0 z-[101] h-0 w-0"
            style={{ x: pointerX, y: pointerY }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.08 }}
          >
            <motion.span
              className="absolute left-0 top-0 block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              animate={{ backgroundColor: appearance.dot }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.div>
        </>
      )}
    </CursorContext.Provider>
  );
};
