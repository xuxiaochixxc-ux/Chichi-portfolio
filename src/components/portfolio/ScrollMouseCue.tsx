import { cn } from "@/lib/utils";

type ScrollMouseCueProps = {
  ariaLabel: string;
  onClick: () => void;
  className?: string;
};

export const ScrollMouseCue = ({
  ariaLabel,
  onClick,
  className,
}: ScrollMouseCueProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={cn("flex flex-col items-center justify-center", className)}
  >
    <span
      className="relative h-9 w-6 rounded-[12px] border border-foreground/60"
      aria-hidden="true"
    >
      <span className="scroll-mouse-wheel absolute left-1/2 top-2 h-1 w-1 -translate-x-1/2 rounded-full bg-foreground/70" />
    </span>
  </button>
);
