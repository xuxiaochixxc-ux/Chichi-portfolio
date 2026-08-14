import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { LifePhoto } from "./beyond-data";

type LifePhotoStripProps = {
  photos: LifePhoto[];
};

const DRAG_THRESHOLD = 5;
const SWIPE_THRESHOLD = 40;

/**
 * Editorial horizontal photography strip with a full-screen lightbox.
 *
 * Desktop: pointer-drag to scroll (mouse only), vertical wheel is converted to
 * horizontal scroll, trackpad horizontal panning is left to the browser.
 * Touch: native horizontal scrolling + swipe-to-navigate inside the lightbox.
 */
export const LifePhotoStrip = ({ photos }: LifePhotoStripProps) => {
  const { t } = useTranslation();
  const reducedMotion = Boolean(useReducedMotion());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({ moved: false, startX: 0, startScrollLeft: 0 });
  const touchState = useRef({ startX: 0, startY: 0 });

  // Convert primarily-vertical wheel motion into horizontal scroll so a mouse
  // wheel can pan the strip; native trackpad horizontal panning is untouched.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        el.scrollLeft += event.deltaY;
        setHasInteracted(true);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [photos.length]);

  const goToIndex = useCallback(
    (step: number) => {
      setActiveIndex((current) => {
        if (current === null || photos.length === 0) return current;
        return (current + step + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  // Keyboard navigation + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      else if (event.key === "ArrowLeft") goToIndex(-1);
      else if (event.key === "ArrowRight") goToIndex(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, goToIndex]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    dragState.current = {
      moved: false,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
    };
    setIsDragging(true);

    const onMove = (ev: PointerEvent) => {
      const node = scrollerRef.current;
      if (!node) return;
      const dx = ev.clientX - dragState.current.startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        dragState.current.moved = true;
        setHasInteracted(true);
      }
      node.scrollLeft = dragState.current.startScrollLeft - dx;
    };
    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handlePhotoClick = (index: number) => (event: ReactMouseEvent<HTMLButtonElement>) => {
    // Suppress the click that follows a drag so dragging never opens the lightbox.
    if (dragState.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setActiveIndex(index);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchState.current.startX = event.touches[0].clientX;
    touchState.current.startY = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const dx = event.changedTouches[0].clientX - touchState.current.startX;
    const dy = event.changedTouches[0].clientY - touchState.current.startY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      goToIndex(dx < 0 ? 1 : -1);
    }
  };

  if (photos.length === 0) return null;

  const currentPhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="relative">
        <span
          className={cn(
            "pointer-events-none absolute -top-5 left-0 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition-opacity duration-300",
            hasInteracted ? "opacity-0" : "opacity-100",
          )}
        >
          {t("beyond.lifeLately.dragHint")}
        </span>
        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          className={cn(
            "flex h-[240px] select-none gap-3 overflow-x-auto sm:h-[300px] md:h-[380px] lg:h-[420px]",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={handlePhotoClick(index)}
              aria-label={photo.alt}
              className="group/life relative h-full shrink-0 overflow-hidden border border-border bg-secondary/20"
              style={{ aspectRatio: photo.aspectRatio }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-[400ms] ease-out group-hover/life:scale-[1.02]"
              />
              {photo.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-background/90 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground opacity-0 transition-opacity duration-200 group-hover/life:opacity-100">
                  {photo.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-background/95 p-6 md:p-12"
            role="dialog"
            aria-modal="true"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeLightbox();
              }}
              aria-label={t("beyond.photography.close")}
              className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToIndex(-1);
              }}
              aria-label={t("beyond.lifeLately.previous")}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground md:left-8"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={1.25} aria-hidden="true" />
            </button>
            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              draggable={false}
              className="max-h-[88vh] max-w-[88vw] object-contain"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToIndex(1);
              }}
              aria-label={t("beyond.lifeLately.next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground md:right-8"
            >
              <ChevronRight className="h-7 w-7" strokeWidth={1.25} aria-hidden="true" />
            </button>
            {currentPhoto.caption && (
              <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {currentPhoto.caption}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
