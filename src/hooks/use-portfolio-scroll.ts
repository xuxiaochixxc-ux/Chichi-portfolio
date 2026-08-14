import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { NavigateFunction } from "react-router-dom";

import type { ViewId } from "@/components/portfolio/data";

const SECTION_IDS: ViewId[] = ["about", "work", "beyond"];
type NavProgress = Record<ViewId, number>;
type ScrollTarget = "home" | ViewId;

const defaultProgress = (active: ViewId): NavProgress => ({
  about: active === "about" ? 1 : 0,
  work: active === "work" ? 1 : 0,
  beyond: active === "beyond" ? 1 : 0,
});

const viewTargetFromHash = (hash: string): ViewId | null => {
  const value = hash.replace(/^#/, "");
  if (value === "skills") return "beyond";
  return SECTION_IDS.includes(value as ViewId) ? (value as ViewId) : null;
};

const viewFromHash = (hash: string): ViewId => viewTargetFromHash(hash) ?? "about";

export const usePortfolioScroll = (
  hash: string,
  pathname: string,
  navigate: NavigateFunction,
) => {
  const reducedMotion = Boolean(useReducedMotion());
  const initialView = viewFromHash(hash);
  const startsAtHome = hash === "" || hash === "#";
  const [isHeroActive, setIsHeroActive] = useState(startsAtHome);
  const [furnitureDocked, setFurnitureDocked] = useState(!startsAtHome);
  const [activeSection, setActiveSection] = useState<ViewId>(initialView);
  const [progress, setProgress] = useState<NavProgress>(() =>
    defaultProgress(initialView),
  );
  const activeRef = useRef(activeSection);
  const heroRef = useRef(isHeroActive);
  const programmaticTarget = useRef<ScrollTarget | null>(
    startsAtHome ? "home" : initialView,
  );
  const initialNavigationDone = useRef(false);
  const scrollAnimation = useRef<ReturnType<typeof animate> | null>(null);

  const scrollToTarget = useCallback(
    (target: ScrollTarget, behavior?: ScrollBehavior) => {
      const element = document.getElementById(target);
      if (!element) return;
      const destination = Math.max(
        0,
        window.scrollY + element.getBoundingClientRect().top -
          (target === "home" ? 0 : 80),
      );
      const resolvedBehavior = behavior ?? (reducedMotion ? "auto" : "smooth");

      scrollAnimation.current?.stop();
      if (resolvedBehavior === "auto") {
        window.scrollTo(0, destination);
        return;
      }

      scrollAnimation.current = animate(window.scrollY, destination, {
        duration: 0.72,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (value) => window.scrollTo(0, value),
      });
    },
    [reducedMotion],
  );

  const navigateToSection = useCallback(
    (id: ViewId) => {
      setFurnitureDocked(true);
      programmaticTarget.current = id;
      navigate({ pathname, hash: id });
      window.requestAnimationFrame(() => scrollToTarget(id));
    },
    [navigate, pathname, scrollToTarget],
  );

  const scrollToHome = useCallback(() => {
    setFurnitureDocked(false);
    programmaticTarget.current = "home";
    navigate({ pathname, hash: "" });
    window.requestAnimationFrame(() => scrollToTarget("home"));
  }, [navigate, pathname, scrollToTarget]);

  useEffect(() => {
    if (!initialNavigationDone.current) {
      initialNavigationDone.current = true;
      const target: ScrollTarget = startsAtHome ? "home" : initialView;
      programmaticTarget.current = target;
      if (hash === "#skills") {
        window.history.replaceState(null, "", `${pathname}#beyond`);
      }
      const first = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToTarget(target, "auto"));
      });
      return () => window.cancelAnimationFrame(first);
    }

    const hashTarget = viewTargetFromHash(hash);
    if (!hashTarget) return;
    if (hash === "#skills") {
      window.history.replaceState(null, "", `${pathname}#beyond`);
    }
    if (programmaticTarget.current === hashTarget) return;
    const targetTop = document.getElementById(hashTarget)?.getBoundingClientRect().top;
    if (targetTop !== undefined && Math.abs(targetTop - 80) < 28) return;
    programmaticTarget.current = hashTarget;
    const frame = window.requestAnimationFrame(() => scrollToTarget(hashTarget));
    return () => window.cancelAnimationFrame(frame);
  }, [hash, initialView, pathname, scrollToTarget, startsAtHome]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const heroRect = document.getElementById("home")?.getBoundingClientRect();
      const nextHeroActive = Boolean(
        heroRect && heroRect.bottom > window.innerHeight * 0.58,
      );

      if (heroRef.current !== nextHeroActive) {
        heroRef.current = nextHeroActive;
        setIsHeroActive(nextHeroActive);
        setFurnitureDocked(!nextHeroActive);
      }

      const lockedTarget = programmaticTarget.current;
      if (lockedTarget) {
        const targetTop = document
          .getElementById(lockedTarget)
          ?.getBoundingClientRect().top;
        const expectedTop = lockedTarget === "home" ? 0 : 80;
        if (targetTop !== undefined && Math.abs(targetTop - expectedTop) < 28) {
          programmaticTarget.current = null;
          if (lockedTarget === "home") {
            window.history.replaceState(null, "", pathname);
          } else {
            activeRef.current = lockedTarget;
            setActiveSection(lockedTarget);
            setProgress(defaultProgress(lockedTarget));
          }
        }
        return;
      }

      if (nextHeroActive) {
        if (window.location.hash) {
          window.history.replaceState(null, "", pathname);
        }
        return;
      }

      const referenceLine = window.innerHeight * 0.35;
      const sections = SECTION_IDS.map((id) => ({
        id,
        rect: document.getElementById(id)?.getBoundingClientRect(),
      })).filter(
        (item): item is { id: ViewId; rect: DOMRect } => Boolean(item.rect),
      );

      const nextActive = sections.reduce<ViewId>((active, item) => {
        return item.rect.top <= referenceLine ? item.id : active;
      }, "about");

      if (activeRef.current !== nextActive) {
        activeRef.current = nextActive;
        setActiveSection(nextActive);
        setProgress(defaultProgress(nextActive));
        window.history.replaceState(null, "", `${pathname}#${nextActive}`);
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!heroRef.current || event.deltaY < 18 || programmaticTarget.current) return;
      event.preventDefault();
      navigateToSection("about");
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigateToSection]);

  return {
    isHeroActive,
    furnitureDocked,
    activeSection,
    progress,
    navigateToSection,
    scrollToHome,
  };
};
