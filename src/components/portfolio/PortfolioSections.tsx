import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { AboutView } from "./AboutView";
import { BeyondView } from "./BeyondView";
import { WorkView } from "./WorkView";

const SectionReveal = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.section
      id={id}
      className="scroll-mt-20 md:scroll-mt-24"
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.04 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

export const PortfolioSections = () => (
  <div className="pb-28 pt-20 md:pb-20 md:pl-24 md:pt-24">
    <SectionReveal id="about"><AboutView /></SectionReveal>
    <SectionReveal id="work"><WorkView /></SectionReveal>
    <SectionReveal id="beyond"><BeyondView /></SectionReveal>
  </div>
);
