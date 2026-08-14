import type { ReactNode } from "react";

export const ChapterEyebrow = ({ children }: { children: ReactNode }) => (
  <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
    {children}
  </p>
);

export const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="border-t border-border pt-10 font-mono text-xs uppercase tracking-[0.2em] text-foreground/80 md:pt-12">
    {children}
  </h2>
);
