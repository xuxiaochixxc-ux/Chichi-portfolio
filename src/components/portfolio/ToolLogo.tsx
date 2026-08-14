import type { CSSProperties } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siAdobeillustrator,
  siAdobephotoshop,
  siArcgis,
  siCanva,
  siClaude,
  siFigma,
  siGithub,
  siMysql,
  siOpenai,
  siPython,
  siQgis,
} from "simple-icons";

import { cn } from "@/lib/utils";

type ToolkitItem = {
  name: string;
  icon?: SimpleIcon;
  imageSrc?: string;
  monochromeInDark?: boolean;
};

type ToolkitGroup = {
  label: string;
  tools: ToolkitItem[];
};

const TOOLKIT_GROUPS: ToolkitGroup[] = [
  {
    label: "01 — AI & BUILDING",
    tools: [
      { name: "ChatGPT", icon: siOpenai },
      { name: "Claude", icon: siClaude },
      { name: "GitHub", icon: siGithub },
    ],
  },
  {
    label: "02 — DESIGN & PROTOTYPING",
    tools: [
      { name: "Figma", icon: siFigma },
      { name: "Adobe Photoshop", icon: siAdobephotoshop },
      { name: "Adobe Illustrator", icon: siAdobeillustrator },
      { name: "Canva", icon: siCanva },
      {
        name: "CapCut",
        imageSrc: "/brand-icons/capcut.svg",
        monochromeInDark: true,
      },
    ],
  },
  {
    label: "03 — DATA & SPATIAL",
    tools: [
      { name: "Python", icon: siPython },
      { name: "MySQL", icon: siMysql },
      { name: "ArcGIS", icon: siArcgis },
      { name: "QGIS", icon: siQgis },
    ],
  },
  {
    label: "04 — PRODUCTIVITY",
    tools: [
      {
        name: "Microsoft Excel",
        imageSrc: "/brand-icons/microsoft-excel.svg",
      },
      {
        name: "Microsoft PowerPoint",
        imageSrc: "/brand-icons/microsoft-powerpoint.svg",
      },
    ],
  },
];

const BrandMark = ({ tool }: { tool: ToolkitItem }) => {
  if (tool.icon) {
    const darkBrand = ["000000", "181717"].includes(tool.icon.hex.toUpperCase());
    const style = {
      "--tool-brand": `#${tool.icon.hex}`,
    } as CSSProperties;

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={style}
        className={cn(
          "h-4 w-4 shrink-0 text-[var(--tool-brand)] transition-colors duration-[250ms] dark:text-muted-foreground",
          darkBrand
            ? "dark:group-hover/tool:text-foreground"
            : "dark:group-hover/tool:text-[var(--tool-brand)]",
        )}
      >
        <path fill="currentColor" d={tool.icon.path} />
      </svg>
    );
  }

  return (
    <img
      src={tool.imageSrc}
      alt=""
      aria-hidden="true"
      className={cn(
        "h-4 w-4 shrink-0 object-contain transition-[filter,opacity] duration-[250ms] dark:brightness-0 dark:grayscale dark:invert dark:opacity-65 dark:group-hover/tool:brightness-100 dark:group-hover/tool:grayscale-0 dark:group-hover/tool:invert-0 dark:group-hover/tool:opacity-100",
        tool.monochromeInDark &&
          "dark:group-hover/tool:brightness-0 dark:group-hover/tool:invert",
      )}
    />
  );
};

export const ToolLogoGrid = () => (
  <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
    {TOOLKIT_GROUPS.map((group) => (
      <section key={group.label}>
        <h4 className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {group.label}
        </h4>
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2.5">
          {group.tools.map((tool) => (
            <li
              key={tool.name}
              className="group/tool inline-flex items-center gap-2 text-xs leading-none text-foreground md:text-sm"
            >
              <BrandMark tool={tool} />
              <span>{tool.name}</span>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);
