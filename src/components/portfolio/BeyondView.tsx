import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import {
  lifePhotos,
  urbanDesignPortfolioPdfUrl,
} from "./beyond-data";
import { ChapterEyebrow, SectionHeading } from "./EditorialHeadings";
import { isChineseLanguage } from "./localized-content";
import { PortfolioBookViewer, PortfolioCoverPreview } from "./PortfolioBookViewer";
import { LifePhotoStrip } from "./LifePhotoStrip";

const EmphasizedText = ({ text, phrases }: { text: string; phrases: string[] }) => {
  if (phrases.length === 0) return <>{text}</>;
  const escaped = [...phrases]
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  const emphasized = new Set(phrases);

  return (
    <>
      {text.split(pattern).map((part, index) =>
        emphasized.has(part) ? (
          <strong key={`${part}-${index}`} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
};

const PrimarySection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      <SectionHeading>{title}</SectionHeading>
      <div className="mt-10 md:mt-12">{children}</div>
    </motion.section>
  );
};

export const BeyondView = () => {
  const { t, i18n } = useTranslation();
  const isChinese = isChineseLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [bookOpen, setBookOpen] = useState(false);

  const campusBlocks = [
    {
      title: t("beyond.campus.eventsTitle"),
      body: t("beyond.campus.eventsBody"),
      emphasis: isChinese
        ? ["12 场国际化研学活动", "从 0 到 1", "35+ 人", "4.7/5"]
        : ["12 international study activities", "from 0 to 1", "35+ participants", "4.7/5"],
    },
    {
      title: t("beyond.campus.partnershipsTitle"),
      body: t("beyond.campus.partnershipsBody"),
      emphasis: isChinese
        ? ["10+ 家头部企业 HR"]
        : ["10+ HR contacts at leading companies"],
    },
  ];

  const researchItems = [
    {
      id: "urban-data-platform",
      institution: t("beyond.academic.organization"),
      title: t("beyond.academic.project"),
      date: t("beyond.academic.date"),
      bullets: [
        {
          body: t("beyond.research.bullet0"),
          emphasis: isChinese ? ["20+ 类城市数据"] : ["20+ categories of urban data"],
        },
        {
          body: t("beyond.research.bullet1"),
          emphasis: isChinese ? ["Python 自动化处理流程"] : ["Python-based automated processing pipeline"],
        },
      ],
    },
  ];

  return (
    <section className="container-grid pb-20 pt-4">
      <div className="col-span-12">
        <header className="pb-16 md:pb-20">
          <ChapterEyebrow>
            CHAPTER 03 · BEYOND
          </ChapterEyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-3xl leading-tight text-foreground md:text-5xl">
            {t("beyond.statement")}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("beyond.supporting")}
          </p>
        </header>

        <PrimarySection title="01 — STUDENT WORK / 学生工作">
          <div className="grid gap-8 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-12">
            <div className="font-mono text-[10px] leading-relaxed text-muted-foreground">
              {t("beyond.campus.date")}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t("beyond.campus.role")}
              </p>
              <h3 className="mt-3 max-w-3xl font-sans text-xl font-medium leading-tight text-foreground md:text-2xl">
                {t("beyond.campus.organization")}
              </h3>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/75 md:text-base">
                {t("beyond.campus.intro")}
              </p>
              <div className="mt-8 grid gap-x-8 md:grid-cols-2">
                {campusBlocks.map((block) => (
                  <article key={block.title} className="border-t border-border py-6">
                    <h4 className="font-sans text-base font-semibold leading-snug text-foreground md:text-lg">
                      {block.title}
                    </h4>
                    <p className="mt-4 text-sm leading-[1.75] text-foreground/80 md:text-[0.9375rem]">
                      <EmphasizedText text={block.body} phrases={block.emphasis} />
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </PrimarySection>

        <div className="mt-24 md:mt-28">
          <PrimarySection title="02 — ACADEMIC PROJECTS / 学术项目">
            <article className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10 lg:gap-14">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t("beyond.academicPortfolio.subtitle")}
                </p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-foreground md:text-5xl">
                  Urban Design Portfolio
                </h3>
                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 md:text-base">
                  {t("beyond.academicPortfolio.description")}
                </p>
                <button
                  type="button"
                  onClick={() => setBookOpen(true)}
                  data-cursor="text-link"
                  className="group mt-8 inline-flex items-center border-b border-foreground/35 pb-1 font-sans text-xs font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent-blue hover:text-accent-blue"
                >
                  {t("beyond.academicPortfolio.view")}
                  <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setBookOpen(true)}
                aria-label={t("beyond.academicPortfolio.view")}
                className="group relative aspect-[4/3] overflow-hidden border border-border bg-secondary/20 text-left"
              >
                <PortfolioCoverPreview
                  pdfUrl={urbanDesignPortfolioPdfUrl}
                  className="transition-transform duration-300 group-hover:scale-[1.01]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-background/90 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground">
                  {t("beyond.academicPortfolio.previewLabel")}
                </span>
              </button>
            </article>

            <div className="mt-16 border-t border-border pt-10 md:mt-20 md:pt-12">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
                RESEARCH EXPERIENCE / 科研经历
              </h4>
              <div className="mt-8 md:mt-10">
                {researchItems.map((item, index) => (
                  <article
                    key={item.id}
                    className={cn(
                      "grid gap-8 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-12",
                      index > 0 && "mt-10 border-t border-border pt-10",
                    )}
                  >
                    <div className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                      {item.date}
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {item.institution}
                      </p>
                      <h3 className="mt-3 max-w-3xl font-sans text-xl font-medium leading-tight text-foreground md:text-2xl">
                        {item.title}
                      </h3>
                      <div className="mt-5 space-y-3">
                        {item.bullets.map((bullet, bulletIndex) => (
                          <p
                            key={bulletIndex}
                            className="flex gap-3 text-sm leading-[1.75] text-foreground/80 md:text-[0.9375rem]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-foreground/40"
                            />
                            <span>
                              <EmphasizedText text={bullet.body} phrases={bullet.emphasis} />
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </PrimarySection>
        </div>

        <div className="mt-24 md:mt-28">
          <PrimarySection title="03 — LIFE, LATELY / 近期生活">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("beyond.lifeLately.supporting")}
              </p>
              {lifePhotos.length > 0 && (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t("beyond.lifeLately.photosCount", { count: lifePhotos.length })}
                </span>
              )}
            </div>
            {lifePhotos.length > 0 && (
              <>
                <div className="mt-6 border-t border-border" />
                <div className="mt-8">
                  <LifePhotoStrip photos={lifePhotos} />
                </div>
              </>
            )}
          </PrimarySection>
        </div>
      </div>

      <PortfolioBookViewer
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        pdfUrl={urbanDesignPortfolioPdfUrl}
      />
    </section>
  );
};
