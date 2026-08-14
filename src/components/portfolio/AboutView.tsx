import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { ChapterEyebrow } from "./EditorialHeadings";
import { ToolLogoGrid } from "./ToolLogo";
import {
  TypewriterIntro,
  type TypewriterLine,
} from "./TypewriterIntro";

const EDUCATION = [
  {
    entry: "ENTRY 01",
    school: "Tongji University 同济大学",
    degree: "M.Eng. in Urban and Rural Planning",
    degreeZh: "城乡规划｜工学硕士",
    period: "2025.09 — 2028.06",
  },
  {
    entry: "ENTRY 02",
    school: "Tongji University 同济大学",
    degree: "B.Eng. in Urban Design",
    degreeZh: "城市设计｜工学学士",
    period: "2020.09 — 2025.06",
  },
];

const TAGS = ["STRATEGY-MINDED", "PRODUCT-DRIVEN", "AI-CURIOUS"];
const ABOUT_INTRO_SESSION_KEY = "portfolio-about-intro-played";

/** Replaceable segmented copy; highlighted words retain the blue accent. */
const INTRO_LINES: TypewriterLine[] = [
  [
    { text: "I move between " },
    { text: "research", highlight: true },
    { text: ", " },
    { text: "products", highlight: true },
    { text: ", and " },
    { text: "growth", highlight: true },
    { text: "," },
  ],
  [{ text: "turning scattered ideas into things" }],
  [{ text: "people can understand, use, and share." }],
];

const revealTransition = (delay: number, reduceMotion: boolean) => ({
  duration: reduceMotion ? 0 : 0.35,
  delay: reduceMotion ? 0 : delay,
  ease: "easeOut" as const,
});

export const AboutView = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [introComplete, setIntroComplete] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) setIntroComplete(true);
  }, [prefersReducedMotion]);

  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);
  const hidden = { opacity: 0, y: prefersReducedMotion ? 0 : 6 };
  const shown = { opacity: 1, y: 0 };
  const revealInitial = introComplete ? false : hidden;

  return (
    <section className="container-grid pb-20 pt-4">
      {/* Left — collage placeholder and focus metadata */}
      <div className="col-span-12 md:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-secondary/40">
          <img
            src="/assets/profile/profile.jpg"
            alt="Portrait of Xiaochi Xu"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-8 border-t border-border pt-4 md:mt-10">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            FOCUS / 当前关注
          </h3>
          <div className="mt-4 space-y-1.5 text-sm leading-relaxed text-foreground md:text-base">
            <span className="block">AI Product Marketing &amp; GTM</span>
            <span className="block">Global Content &amp; Growth</span>
            <span className="block">Product Operations</span>
            <span className="block">Cross-cultural Communication</span>
          </div>
        </div>
      </div>

      {/* Right — statement, tags, bio, metadata, resume */}
      <div className="col-span-12 mt-10 md:col-span-7 md:mt-0 md:pl-8">
        <ChapterEyebrow>
          CHAPTER 01 · ABOUT
        </ChapterEyebrow>

        <TypewriterIntro
          lines={INTRO_LINES}
          sessionKey={ABOUT_INTRO_SESSION_KEY}
          onComplete={handleIntroComplete}
          className="mt-6 font-display text-2xl font-normal leading-[1.08] tracking-[-0.015em] text-foreground md:text-4xl"
        />

        <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
          {TAGS.map((tag, index) => (
            <motion.span
              key={tag}
              initial={revealInitial}
              animate={introComplete ? shown : hidden}
              transition={revealTransition(index * 0.1, prefersReducedMotion)}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-blue dark:text-accent-yellow"
            >
              {index > 0 && (
                <span className="mr-3 text-border" aria-hidden="true">
                  /
                </span>
              )}
              {tag}
            </motion.span>
          ))}
        </div>

        <div className="mt-7 max-w-prose space-y-4">
          {["about.bio.0", "about.bio.1"]
            .filter((key) => t(key).trim().length > 0)
            .map((key, index) => (
            <motion.p
              key={key}
              initial={revealInitial}
              animate={introComplete ? shown : hidden}
              transition={revealTransition(
                0.4 + index * 0.15,
                prefersReducedMotion,
              )}
              className="text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {t(key)}
            </motion.p>
          ))}
        </div>

        <motion.dl
          initial={revealInitial}
          animate={introComplete ? shown : hidden}
          transition={revealTransition(0.75, prefersReducedMotion)}
          className="mt-10 border-t border-border"
        >
          <div className="grid gap-5 border-b border-border py-4 md:grid-cols-[10rem_1fr] md:gap-8">
            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              EDUCATION / 学历
            </dt>
            <dd className="space-y-6">
              {EDUCATION.map((item) => (
                <div key={item.entry} className="grid gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {item.entry}
                  </span>
                  <span className="text-sm font-medium text-foreground md:text-base">
                    {item.school}
                  </span>
                  <span className="text-sm text-foreground md:text-base">
                    {item.degree}
                  </span>
                  <span className="text-sm text-muted-foreground md:text-base">
                    {item.degreeZh}
                  </span>
                  <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {item.period}
                  </span>
                </div>
              ))}
            </dd>
          </div>

          <div className="grid gap-3 border-b border-border py-4 md:grid-cols-[10rem_1fr] md:gap-8">
            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              LANGUAGES / 语言
            </dt>
            <dd className="space-y-1.5 text-sm leading-relaxed text-foreground md:text-base">
              <span className="block">English — IELTS 8.0 · Speaking 7.5</span>
              <span className="block">German — A2</span>
            </dd>
          </div>

          <div className="grid gap-3 py-4 md:grid-cols-[10rem_1fr] md:gap-8">
            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              TOOLS / 工具
            </dt>
            <dd>
              <ToolLogoGrid />
            </dd>
          </div>
        </motion.dl>

        <motion.button
          type="button"
          initial={revealInitial}
          animate={introComplete ? shown : hidden}
          transition={revealTransition(0.9, prefersReducedMotion)}
          data-cursor="text-link"
          className="mt-8 inline-flex items-center font-sans text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent-blue dark:hover:text-accent-yellow"
        >
          CHECK MY RESUME →
        </motion.button>
      </div>
    </section>
  );
};
