import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
  type RenderTask,
} from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const PDF_WASM_URL = "/pdfjs-wasm/";
const pdfSource = (url: string) => ({ url, wasmUrl: PDF_WASM_URL });

GlobalWorkerOptions.workerSrc = pdfWorker;

type PortfolioBookViewerProps = {
  open: boolean;
  onClose: () => void;
  pdfUrl: string | null;
};

const PdfPage = ({
  pdfDocument,
  pageNumber,
}: {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    let active = true;
    let renderGeneration = 0;
    let resizeFrame = 0;
    let renderTask: RenderTask | null = null;

    const renderPage = async () => {
      const generation = ++renderGeneration;

      if (renderTask) {
        renderTask.cancel();
        try {
          await renderTask.promise;
        } catch (error) {
          if (!(error instanceof Error) || error.name !== "RenderingCancelledException") {
            throw error;
          }
        }
      }

      if (!active || generation !== renderGeneration) return;

      try {
        const page = await pdfDocument.getPage(pageNumber);
        if (!active || generation !== renderGeneration) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(160, frame.clientWidth);
        const scale = (availableWidth * window.devicePixelRatio) / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${viewport.width / window.devicePixelRatio}px`;
        canvas.style.height = `${viewport.height / window.devicePixelRatio}px`;
        const nextRenderTask = page.render({ canvas, viewport });
        renderTask = nextRenderTask;
        await nextRenderTask.promise;
      } catch (error) {
        if (error instanceof Error && error.name === "RenderingCancelledException") return;
        throw error;
      }
    };

    const scheduleRender = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        void renderPage().catch((error) => {
          if (error instanceof Error && error.name === "RenderingCancelledException") return;
          console.error("Failed to render portfolio page", error);
        });
      });
    };

    const observer = new ResizeObserver(scheduleRender);
    observer.observe(frame);
    scheduleRender();

    return () => {
      active = false;
      renderGeneration += 1;
      window.cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      renderTask?.cancel();
    };
  }, [pdfDocument, pageNumber]);

  return (
    <div ref={frameRef} className="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-secondary/20">
      <canvas ref={canvasRef} className="block max-h-full max-w-full object-contain" />
    </div>
  );
};

const EmptyPage = ({ side }: { side: "left" | "right" }) => (
  <div
    className={cn(
      "relative min-w-0 flex-1 overflow-hidden border-border bg-background",
      side === "left" ? "border-r" : "border-l",
    )}
  >
    <span className="absolute bottom-4 left-4 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground/55">
      {side === "left" ? "LEFT PAGE" : "RIGHT PAGE"}
    </span>
  </div>
);

export const PortfolioCoverPreview = ({
  pdfUrl,
  className,
}: {
  pdfUrl: string;
  className?: string;
}) => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const task = getDocument(pdfSource(pdfUrl));
    void task.promise
      .then((nextDocument) => {
        if (active) setPdfDocument(nextDocument);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      void task.destroy();
    };
  }, [pdfUrl]);

  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-secondary/20", className)}>
      {pdfDocument ? (
        <PdfPage pdfDocument={pdfDocument} pageNumber={1} />
      ) : (
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          {failed ? "Preview unavailable" : "Loading preview"}
        </span>
      )}
    </div>
  );
};

export const PortfolioBookViewer = ({
  open,
  onClose,
  pdfUrl,
}: PortfolioBookViewerProps) => {
  const { t } = useTranslation();
  const reducedMotion = Boolean(useReducedMotion());
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [spreadStart, setSpreadStart] = useState(1);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!open || !pdfUrl) {
      setPdfDocument(null);
      setSpreadStart(1);
      setLoadError(false);
      return;
    }

    let active = true;
    const task = getDocument(pdfSource(pdfUrl));
    void task.promise
      .then((nextDocument) => {
        if (!active) return;
        setPdfDocument(nextDocument);
        setLoadError(false);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
      void task.destroy();
    };
  }, [open, pdfUrl]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        setSpreadStart((current) => Math.max(1, current - 2));
      }
      if (event.key === "ArrowRight" && pdfDocument) {
        setSpreadStart((current) => Math.min(pdfDocument.numPages, current + 2));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pdfDocument, onClose, open]);

  const totalPages = pdfDocument?.numPages ?? 0;
  const canGoPrevious = spreadStart > 1;
  const canGoNext = Boolean(pdfDocument && spreadStart + 1 < totalPages);
  const pageIndicator = totalPages
    ? `${String(spreadStart).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`
    : "-- / --";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          className="fixed inset-0 z-[90] bg-foreground/20 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            initial={reducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reducedMotion ? undefined : { x: "100%" }}
            transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t("beyond.academicPortfolio.viewerLabel")}
            className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-border bg-background md:w-[80vw]"
          >
            <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-5 md:px-8">
              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-medium text-foreground">
                  Urban Design Portfolio
                </p>
                <p className="mt-0.5 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
                  {pageIndicator}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                aria-label={t("beyond.academicPortfolio.close")}
                className="ml-auto text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col p-4 md:p-8">
              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={spreadStart}
                    initial={reducedMotion ? false : { opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, x: -22 }}
                    transition={{ duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
                    className="flex aspect-[1.42/1] max-h-full w-full max-w-6xl border border-border bg-secondary/15"
                  >
                    {pdfDocument ? (
                      <>
                        <PdfPage pdfDocument={pdfDocument} pageNumber={spreadStart} />
                        {spreadStart + 1 <= totalPages ? (
                          <PdfPage pdfDocument={pdfDocument} pageNumber={spreadStart + 1} />
                        ) : (
                          <EmptyPage side="right" />
                        )}
                      </>
                    ) : (
                      <>
                        <EmptyPage side="left" />
                        <EmptyPage side="right" />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {pdfDocument && (
                  <>
                    <button
                      type="button"
                      disabled={!canGoPrevious}
                      onClick={() => setSpreadStart((current) => Math.max(1, current - 2))}
                      aria-label={t("beyond.academicPortfolio.previous")}
                      className="group/page absolute inset-y-0 left-0 z-10 w-1/2 cursor-w-resize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-default"
                    >
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/0 transition-colors duration-200 group-hover/page:text-foreground/45 group-disabled/page:hidden md:left-5">
                        <ChevronLeft className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={!canGoNext}
                      onClick={() => setSpreadStart((current) => Math.min(totalPages, current + 2))}
                      aria-label={t("beyond.academicPortfolio.next")}
                      className="group/page absolute inset-y-0 right-0 z-10 w-1/2 cursor-e-resize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-default"
                    >
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/0 transition-colors duration-200 group-hover/page:text-foreground/45 group-disabled/page:hidden md:right-5">
                        <ChevronRight className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
                      </span>
                    </button>
                  </>
                )}

                {(!pdfUrl || loadError) && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
                    <div className="max-w-xs px-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/75">
                        {loadError
                          ? t("beyond.academicPortfolio.loadError")
                          : t("beyond.academicPortfolio.filePending")}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {t("beyond.academicPortfolio.filePendingNote")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <footer className="mt-4 flex shrink-0 items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  disabled={!canGoPrevious}
                  onClick={() => setSpreadStart((current) => Math.max(1, current - 2))}
                  className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.12em] text-foreground transition-opacity disabled:opacity-25"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  {t("beyond.academicPortfolio.previous")}
                </button>
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
                  {pageIndicator}
                </span>
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setSpreadStart((current) => Math.min(totalPages, current + 2))}
                  className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.12em] text-foreground transition-opacity disabled:opacity-25"
                >
                  {t("beyond.academicPortfolio.next")}
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </footer>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
