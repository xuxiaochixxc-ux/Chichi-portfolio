import { useTranslation } from "react-i18next";

import { fallbackLng, normalizeLanguage } from "@/i18n/config";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
};

const OPTIONS: { code: string; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh-CN", label: "中文" },
];

/**
 * Minimal "EN / 中文" text switch — the editorial replacement for the
 * dropdown LanguageSwitcher. The active language reads at full opacity;
 * the inactive one is dimmed and restored on hover.
 */
export const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const { i18n } = useTranslation();
  const current =
    normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? fallbackLng;

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em]",
        className,
      )}
    >
      {OPTIONS.map((opt, i) => (
        <span key={opt.code} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted-foreground opacity-40">/</span>}
          <button
            type="button"
            data-cursor="text-link"
            onClick={() => void i18n.changeLanguage(opt.code)}
            className={cn(
              "transition-opacity",
              current === opt.code
                ? "text-foreground opacity-100"
                : "text-muted-foreground opacity-60 hover:opacity-100",
            )}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
};
