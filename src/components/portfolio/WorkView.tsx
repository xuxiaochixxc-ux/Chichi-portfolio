import { useTranslation } from "react-i18next";

import { Accordion } from "@/components/ui/accordion";
import { AccordionRow } from "./AccordionRow";
import { ProjectShowcase } from "./ProjectShowcase";
import { internships, selectedWorkGroups } from "./data";
import { ChapterEyebrow, SectionHeading } from "./EditorialHeadings";
import { InternshipDetails } from "./WorkDetails";
import {
  isChineseLanguage,
  localizeBilingualLabel,
} from "./localized-content";

export const WorkView = () => {
  const { t, i18n } = useTranslation();
  const isChinese = isChineseLanguage(i18n.resolvedLanguage ?? i18n.language);
  const prototypeGroup = selectedWorkGroups.find(
    (group) => group.id === "ai-prototypes",
  );

  return (
    <section className="container-grid pb-20 pt-4">
      <div className="col-span-12">
        <header className="pb-14">
          <ChapterEyebrow>
            CHAPTER 02 · WORK
          </ChapterEyebrow>
          <h1 className="mt-5 font-display text-3xl text-foreground md:text-5xl">
            {isChinese ? "项目经历" : "WORK"}
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/80 md:text-base">
            {t("work.introduction")}
          </p>
        </header>

        <section>
          <SectionHeading>
            A — EXPERIENCE / 实习经历
          </SectionHeading>
          <Accordion type="single" collapsible className="mt-10 w-full">
            {internships.map((item) => (
              <AccordionRow
                key={item.id}
                value={item.id}
                title={localizeBilingualLabel(item.company, isChinese)}
                subtitle={localizeBilingualLabel(item.role, isChinese)}
                period={localizeBilingualLabel(item.period, isChinese)}
                tags={item.tags}
                showTags={false}
                emphasizeSubtitle
              >
                <InternshipDetails item={item} />
              </AccordionRow>
            ))}
          </Accordion>
        </section>

        <section className="mt-24">
          <SectionHeading>
            B — SELECTED WORK / 精选项目
          </SectionHeading>
          {prototypeGroup && (
            <ProjectShowcase projects={prototypeGroup.items} />
          )}
        </section>

      </div>
    </section>
  );
};
