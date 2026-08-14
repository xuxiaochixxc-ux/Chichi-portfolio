import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { SelectedProject } from "./data";
import {
  isChineseLanguage,
  localizeBilingualLabel,
} from "./localized-content";

type ProjectShowcaseProps = {
  projects: SelectedProject[];
};

const ProjectThumbnail = ({
  project,
  index,
  active,
  onSelect,
  className,
}: {
  project: SelectedProject;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={() => onSelect(index)}
    aria-label={`View ${project.number}: ${project.title}`}
    aria-current={active ? "true" : undefined}
    className={cn(
      "group relative shrink-0 overflow-hidden border bg-secondary/40 transition-[opacity,border-color] duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
      active ? "border-foreground opacity-100" : "border-border opacity-45 hover:opacity-75",
      className,
    )}
  >
    <img
      src={project.coverImage}
      alt=""
      className="h-full w-full object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
    />
    <span className="absolute bottom-2 left-2 bg-background/85 px-1.5 py-1 font-mono text-[8px] tracking-[0.12em] text-foreground">
      {project.number}
    </span>
  </button>
);

const ProjectEditorialLink = ({
  href,
  label,
  reducedMotion,
}: {
  href: string;
  label: string;
  reducedMotion: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-cursor="text-link"
    className="group/link relative inline-flex items-baseline font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-accent-blue transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
  >
    <span>{label}</span>
    <span
      aria-hidden="true"
      className={cn(
        "ml-1 inline-block transition-transform duration-200",
        !reducedMotion && "group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5",
      )}
    >
      ↗
    </span>
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-1 left-0 h-px w-full origin-left bg-current",
        reducedMotion
          ? "scale-x-0 group-hover/link:scale-x-100"
          : "scale-x-0 transition-transform duration-200 ease-out group-hover/link:scale-x-100",
      )}
    />
  </a>
);

export const ProjectShowcase = ({ projects }: ProjectShowcaseProps) => {
  const { i18n } = useTranslation();
  const reducedMotion = Boolean(useReducedMotion());
  const isChinese = isChineseLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProject = projects[currentIndex] ?? projects[0];

  if (!currentProject) return null;

  const introduction = currentProject.showcaseCopy?.[isChinese ? "zh" : "en"];
  const leftProjects = projects.slice(0, currentIndex);
  const rightProjects = projects.slice(currentIndex + 1);

  return (
    <div className="pb-12 pt-7 md:pb-16 md:pt-10">
      <div className="hidden grid-cols-[1fr_auto_1fr] items-end gap-2 md:grid lg:gap-3">
        <div className="flex items-end justify-end gap-2 lg:gap-3">
          {leftProjects.map((project, index) => (
            <ProjectThumbnail
              key={project.id}
              project={project}
              index={index}
              active={false}
              onSelect={setCurrentIndex}
              className="aspect-video w-32 lg:w-40"
            />
          ))}
        </div>

        <div className="relative mx-1 aspect-video w-[min(58vw,46rem)] shrink-0 overflow-hidden bg-secondary/50">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentProject.id}
              src={currentProject.coverImage}
              alt={localizeBilingualLabel(currentProject.title, isChinese)}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>

        <div className="flex items-end justify-start gap-2 lg:gap-3">
          {rightProjects.map((project, offset) => {
            const index = currentIndex + 1 + offset;
            return (
              <ProjectThumbnail
                key={project.id}
                project={project}
                index={index}
                active={false}
                onSelect={setCurrentIndex}
                className="aspect-video w-32 lg:w-40"
              />
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative aspect-video w-full overflow-hidden bg-secondary/50">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentProject.id}
              src={currentProject.coverImage}
              alt={localizeBilingualLabel(currentProject.title, isChinese)}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {projects.map((project, index) => (
            <ProjectThumbnail
              key={project.id}
              project={project}
              index={index}
              active={index === currentIndex}
              onSelect={setCurrentIndex}
              className="aspect-video w-32"
            />
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-5 border-t border-border pt-5 md:grid-cols-[5rem_1fr_auto] md:items-start md:gap-7">
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
          {currentProject.number}
        </span>
        <div>
          <h4 className="font-sans text-xl font-medium leading-tight text-foreground md:text-2xl">
            {localizeBilingualLabel(currentProject.title, isChinese)}
          </h4>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {currentProject.tags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/60">
                {tag}
              </span>
            ))}
          </div>
          {(currentProject.liveUrl || currentProject.githubUrl) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              {currentProject.liveUrl && (
                <ProjectEditorialLink
                  href={currentProject.liveUrl}
                  label="VIEW LIVE"
                  reducedMotion={reducedMotion}
                />
              )}
              {currentProject.liveUrl && currentProject.githubUrl && (
                <span
                  aria-hidden="true"
                  className="font-mono text-[9px] text-muted-foreground/60"
                >
                  /
                </span>
              )}
              {currentProject.githubUrl && (
                <ProjectEditorialLink
                  href={currentProject.githubUrl}
                  label="GITHUB"
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          )}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground md:text-right">
          {localizeBilingualLabel(currentProject.year, isChinese)}
        </span>
      </div>

      {introduction && (
        <div className="mt-8 max-w-3xl space-y-4">
          {introduction.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[13px] leading-relaxed text-foreground/80 md:text-sm"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
