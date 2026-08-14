import { LanguageToggle } from "./LanguageToggle";

type SiteHeaderProps = {
  onHome: () => void;
};

/**
 * Fixed top bar shown only in content views. The wordmark returns to the
 * hero view; the language toggle sits on the right.
 */
export const SiteHeader = ({ onHome }: SiteHeaderProps) => (
  <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-background">
    <div className="flex h-full items-center gap-4 px-6 md:pl-24 md:pr-10">
      <button
        type="button"
        onClick={onHome}
        data-cursor="text-link"
        className="group flex items-baseline gap-3"
      >
        <span className="font-display text-lg tracking-tight text-foreground">
          Chichi Xu
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
          Portfolio / 作品集
        </span>
      </button>
      <LanguageToggle className="ml-auto mr-28 md:mr-44" />
    </div>
  </header>
);
