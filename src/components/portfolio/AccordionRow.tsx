import * as React from "react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type AccordionRowProps = {
  value: string;
  index?: string;
  title: string;
  subtitle?: string;
  period: string;
  tags: string[];
  showTags?: boolean;
  emphasizeSubtitle?: boolean;
  children: React.ReactNode;
  className?: string;
};

const HeaderTags = ({ tags }: { tags: string[] }) => (
  <span className="flex flex-wrap gap-x-2 gap-y-1">
    {tags.map((tag) => (
      <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/65">
        {tag}
      </span>
    ))}
  </span>
);

export const AccordionRow = ({
  value,
  index,
  title,
  subtitle,
  period,
  tags,
  showTags = true,
  emphasizeSubtitle = false,
  children,
  className,
}: AccordionRowProps) => (
  <AccordionItem value={value} className="divider-line border-b-0">
    <AccordionTrigger className="group items-start gap-3 py-4 text-left font-normal hover:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background md:items-center">
      {index && (
        <span className="w-8 shrink-0 pt-0.5 font-mono text-[10px] text-foreground/60 md:pt-0">
          {index}
        </span>
      )}
      <span className="grid min-w-0 flex-1 gap-2 pr-2 md:grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_auto] md:items-center md:gap-5">
        <span className="min-w-0 font-sans text-base leading-tight text-foreground md:text-lg">{title}</span>
        <span className="flex min-w-0 flex-col items-start gap-1 text-left">
          {subtitle && (
            <span
              className={cn(
                "leading-snug text-foreground",
                emphasizeSubtitle
                  ? "whitespace-nowrap text-sm font-medium md:text-base"
                  : "text-xs md:text-sm",
              )}
            >
              {subtitle}
            </span>
          )}
          {showTags && <HeaderTags tags={tags} />}
        </span>
        <span className="font-mono text-[10px] leading-snug text-foreground/65 md:text-right">{period}</span>
      </span>
    </AccordionTrigger>
    <AccordionContent
      className={cn(
        "pb-7 pr-4 pt-2 md:pr-12",
        index ? "pl-11 md:pl-11" : "pl-0 md:pl-0",
        className,
      )}
    >
      {children}
    </AccordionContent>
  </AccordionItem>
);
