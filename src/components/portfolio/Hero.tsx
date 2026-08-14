import { useState, type PointerEvent } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";

import { useCustomCursor } from "./cursor-context";

import { useIsMobile } from "@/hooks/use-mobile";
import { navItems, type ViewId } from "./data";
import type { FurnitureInteraction } from "./FurnitureLayer";
import { ScrollMouseCue } from "./ScrollMouseCue";

type HeroProps = {
  onNavigate: (view: ViewId) => void;
  onEnterAbout: () => void;
  onFurnitureInteraction: (interaction: FurnitureInteraction) => void;
};

type HeroItemProps = {
  item: (typeof navItems)[number];
  isMobile: boolean;
  onNavigate: (view: ViewId) => void;
  onInteraction: (interaction: FurnitureInteraction) => void;
};

const HeroItem = ({
  item,
  isMobile,
  onNavigate,
  onInteraction,
}: HeroItemProps) => {
  const [hovered, setHovered] = useState(false);
  const { enabled: cursorEnabled, reducedMotion } = useCustomCursor();

  const resetMagnetism = () => {
    onInteraction({ id: null, x: 0, y: 0 });
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!cursorEnabled || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relativeY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    onInteraction({
      id: item.id,
      x: Math.max(-5, Math.min(5, relativeX * 5)),
      y: Math.max(-5, Math.min(5, relativeY * 5)),
    });
  };

  return (
    <motion.button
      type="button"
      onHoverStart={() => {
        setHovered(true);
        onInteraction({ id: item.id, x: 0, y: 0 });
      }}
      onHoverEnd={() => {
        setHovered(false);
        resetMagnetism();
      }}
      onPointerMove={handlePointerMove}
      data-cursor={`hero-${item.id}`}
      aria-label={`${item.labelLine1}: ${item.labelLine2}`}
      onClick={() => onNavigate(item.id)}
      className="flex flex-col items-center gap-4"
    >
      <div
        data-furniture-source={item.id}
        className="h-36 w-36 md:h-[clamp(11rem,22vw,18rem)] md:w-[clamp(11rem,22vw,18rem)]"
      />
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="hero-cursor-ink font-sans text-xs uppercase tracking-[0.25em]">
          {item.labelLine1}
        </span>
        <div className="h-5">
          <AnimatePresence initial={false}>
            {(isMobile || hovered) && (
              <motion.span
                key="line2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hero-cursor-ink hero-cursor-ink-muted block font-sans text-xs uppercase tracking-[0.25em]"
              >
                {item.labelLine2}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
};

/**
 * Hero landing: three grayscale illustrations that colorize and reveal a
 * second label line with opacity only (desktop). Fixed label space prevents
 * any hover-driven layout shift. On mobile the second line is always shown.
 */
export const Hero = ({
  onNavigate,
  onEnterAbout,
  onFurnitureInteraction,
}: HeroProps) => {
  const isMobile = useIsMobile();
  const { enabled: cursorEnabled, reducedMotion } = useCustomCursor();
  const shadowX = useMotionValue(0);
  const shadowY = useMotionValue(0);

  const handleNamePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!cursorEnabled || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX =
      (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const offsetY = Math.abs(
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
    );

    animate(shadowX, Math.max(-10, Math.min(10, -offsetX * 10)), {
      duration: 0.22,
      ease: "easeOut",
    });
    animate(shadowY, -Math.min(8, 3 + offsetY * 5), {
      duration: 0.22,
      ease: "easeOut",
    });
  };

  const resetNameShadow = () => {
    animate(shadowX, 0, { duration: 0.3, ease: "easeOut" });
    animate(shadowY, 0, { duration: 0.3, ease: "easeOut" });
  };

  return (
    <section id="home" className="relative flex min-h-screen scroll-mt-0 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 md:pb-12 md:pt-6">
        <div
          onPointerMove={handleNamePointerMove}
          onPointerLeave={resetNameShadow}
          className="flex w-full flex-col items-center"
        >
          <h1 className="relative flex h-28 w-full items-center justify-center text-center md:h-36 lg:h-44">
            <span className="pointer-events-none absolute inset-0 flex -translate-y-2 items-center justify-center overflow-visible md:-translate-y-3" aria-hidden="true">
              <motion.span
                style={{ x: shadowX, y: shadowY }}
                className="hero-name-background whitespace-nowrap font-display text-[3.8rem] leading-[0.8] tracking-[-0.07em] md:text-[8.8rem] lg:text-[11.2rem] xl:text-[12rem]"
              >
                Chichi Xu
              </motion.span>
            </span>
            <span className="hero-cursor-ink relative z-10 translate-y-2.5 font-display text-3xl tracking-[0.14em] text-foreground md:text-4xl lg:text-5xl">
              徐晓驰
            </span>
            <span className="sr-only">Chichi Xu</span>
          </h1>

          <p className="mt-4 text-center font-sans text-[11px] leading-relaxed md:mt-5 md:text-sm">
            <span className="hero-cursor-ink hero-cursor-ink-muted block">
              AI Products / Growth &amp; Operations / Global Perspective
            </span>
            <span className="hero-cursor-ink hero-cursor-ink-muted mt-1 block">
              AI 产品 / 运营与增长 / 全球视野
            </span>
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center gap-8 md:-mt-1 md:flex-row md:gap-4 lg:-mt-4 lg:gap-6">
          {navItems.map((item) => (
            <HeroItem
              key={item.id}
              item={item}
              isMobile={isMobile}
              onNavigate={onNavigate}
              onInteraction={onFurnitureInteraction}
            />
          ))}
        </div>

        <p className="hero-cursor-ink hero-cursor-ink-muted mt-1 -translate-y-1 pb-12 text-center font-sans text-[8px] tracking-[0.18em] md:mt-0 md:pb-0 md:text-[9px]">
          Choose where to begin
        </p>
      </div>

      <ScrollMouseCue
        ariaLabel="Scroll to About"
        onClick={onEnterAbout}
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
      />
    </section>
  );
};
