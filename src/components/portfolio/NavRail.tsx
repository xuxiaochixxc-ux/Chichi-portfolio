import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { navItems, type ViewId } from "./data";
import type { FurnitureInteraction } from "./FurnitureLayer";

type NavProgress = Record<ViewId, number>;

type NavRailProps = {
  current: ViewId;
  progress?: NavProgress;
  visible: boolean;
  onNavigate: (view: ViewId) => void;
  onFurnitureInteraction: (interaction: FurnitureInteraction) => void;
};

type NavButtonProps = {
  item: (typeof navItems)[number];
  emphasis: number;
  active: boolean;
  onNavigate: (view: ViewId) => void;
  onFurnitureInteraction: (interaction: FurnitureInteraction) => void;
};

const NavButton = ({
  item,
  emphasis,
  active,
  onNavigate,
  onFurnitureInteraction,
}: NavButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const visualEmphasis = hovered ? 1 : emphasis;

  return (
    <button
      type="button"
      aria-label={item.labelLine1}
      aria-current={active ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
      onPointerEnter={() => {
        setHovered(true);
        onFurnitureInteraction({ id: item.id, x: 0, y: 0 });
      }}
      onPointerLeave={() => {
        setHovered(false);
        onFurnitureInteraction({ id: null, x: 0, y: 0 });
      }}
      className="flex flex-col items-center gap-1.5 transition-all duration-300"
      style={{
        opacity: 0.35 + visualEmphasis * 0.65,
        filter: `grayscale(${1 - visualEmphasis})`,
      }}
    >
      <div
        data-furniture-target={item.id}
        className="h-11 w-11 md:h-12 md:w-12"
      />
      <span
        className={cn(
          "font-sans text-[10px] uppercase tracking-[0.15em]",
          visualEmphasis > 0.55 ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {item.labelLine1}
      </span>
    </button>
  );
};

export const NavRail = ({
  current,
  progress,
  visible,
  onNavigate,
  onFurnitureInteraction,
}: NavRailProps) => {
  const emphasisFor = (id: ViewId) =>
    progress?.[id] ?? (current === id ? 1 : 0);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(!visible && "pointer-events-none")}
      aria-hidden={!visible}
    >
      <nav className="hidden md:flex fixed left-0 top-0 z-30 h-full w-24 flex-col items-center justify-center gap-11 border-r border-border bg-background">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            emphasis={emphasisFor(item.id)}
            active={current === item.id}
            onNavigate={onNavigate}
            onFurnitureInteraction={onFurnitureInteraction}
          />
        ))}
      </nav>

      <nav className="flex md:hidden fixed inset-x-0 bottom-0 z-40 h-16 flex-row items-center justify-around border-t border-border bg-background">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            emphasis={emphasisFor(item.id)}
            active={current === item.id}
            onNavigate={onNavigate}
            onFurnitureInteraction={onFurnitureInteraction}
          />
        ))}
      </nav>
    </motion.div>
  );
};
