import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import type { FutureReadyFields, Internship, SelectedProject } from "./data";
import {
  isChineseLanguage,
  localizeBilingualLabel,
} from "./localized-content";

const ContentReveal = ({ children }: { children: React.ReactNode }) => {
  const reduceMotion = Boolean(useReducedMotion());
  return (
    <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
};

const FutureResources = ({ resources }: { resources: FutureReadyFields }) => {
  const links = [
    ...resources.documents,
    ...resources.externalLinks,
    ...(resources.caseStudyUrl ? [{ label: "CASE STUDY", url: resources.caseStudyUrl }] : []),
    ...(resources.projectUrl ? [{ label: "VIEW PROJECT", url: resources.projectUrl }] : []),
  ].filter((item) => item.url);
  const media = resources.media.filter((item) => item.src);
  if (links.length === 0 && media.length === 0) return null;
  return (
    <div className="divider-line mt-6 pt-4">
      {links.map((link) => <a key={link.url} href={link.url} data-cursor="text-link" className="mr-5 font-sans text-[10px] uppercase tracking-[0.15em] text-accent-blue">{link.label}</a>)}
    </div>
  );
};

const renderEmphasizedText = (text: string, phrases: string[]) => {
  if (phrases.length === 0) return text;
  const escaped = [...phrases]
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  const emphasized = new Set(phrases);

  return text.split(pattern).map((part, index) =>
    emphasized.has(part) ? (
      <strong key={`${part}-${index}`} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );
};

export const InternshipDetails = ({ item }: { item: Internship }) => {
  const { t, i18n } = useTranslation();
  const isChinese = isChineseLanguage(i18n.resolvedLanguage ?? i18n.language);
  const isConverge = item.id === "intern-converge";
  const hasStructuredDetails = Boolean(item.coreSkills);

  return (
    <ContentReveal>
      {hasStructuredDetails && item.coreSkills ? (
        <div className="grid gap-3 md:grid-cols-[10rem_1fr] md:gap-8">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70">
            {isChinese ? "核心能力" : "CORE SKILLS"}
          </h4>
          <p className="text-sm font-medium leading-relaxed text-foreground md:text-base">
            {isChinese ? item.coreSkills.zh : item.coreSkills.en}
          </p>
        </div>
      ) : (
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/80 md:text-base">
          {t(item.overviewKey)}
        </p>
      )}

      <div className={hasStructuredDetails ? "mt-7 grid gap-x-8 md:grid-cols-2" : "mt-9 grid gap-x-8 md:grid-cols-2"}>
        {item.contributions.map((contribution) => {
          const body = t(contribution.bodyKey);
          const emphasis = contribution.emphasis?.[isChinese ? "zh" : "en"] ?? [];

          return (
            <section key={contribution.title} className="divider-line py-6 md:py-7">
              {hasStructuredDetails && contribution.index && (
                <span className="mb-3 block font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                  {contribution.index}
                </span>
              )}
              <h4 className={`font-sans text-[1.0625rem] uppercase leading-[1.35] tracking-[-0.01em] text-foreground md:text-[1.1875rem] ${isConverge ? "font-medium" : "font-semibold"}`}>
                {localizeBilingualLabel(contribution.title, isChinese)}
              </h4>
              <p className="mt-4 text-[0.9375rem] font-normal leading-[1.75] text-foreground/80 md:text-base">
                {hasStructuredDetails ? renderEmphasizedText(body, emphasis) : body}
              </p>
            </section>
          );
        })}
      </div>
      <FutureResources resources={item} />
    </ContentReveal>
  );
};

export const ProjectDetails = ({ item }: { item: SelectedProject }) => {
  const { t, i18n } = useTranslation();
  const isChinese = isChineseLanguage(i18n.resolvedLanguage ?? i18n.language);
  return (
    <ContentReveal>
      <p className="max-w-3xl text-base leading-relaxed text-foreground md:text-lg">{t(item.summaryKey)}</p>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/80 md:text-base">{t(item.descriptionKey)}</p>
      <div className="divider-line mt-7 grid gap-3 pt-4 md:grid-cols-[10rem_1fr]">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70">
          {isChinese ? "我的角色" : "MY ROLE"}
        </h4>
        <div className="space-y-1 text-sm leading-relaxed text-foreground">
          <p>{isChinese ? item.roleZh : item.role}</p>
        </div>
      </div>
      <FutureResources resources={item} />
    </ContentReveal>
  );
};
