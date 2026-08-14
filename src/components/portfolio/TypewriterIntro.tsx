import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type TypewriterSegment = {
  text: string;
  highlight?: boolean;
};

export type TypewriterLine = TypewriterSegment[];

type TypewriterIntroProps = {
  lines: TypewriterLine[];
  sessionKey: string;
  onComplete: () => void;
  className?: string;
};

type PreparedLine = {
  segments: Array<TypewriterSegment & { start: number }>;
  start: number;
  length: number;
};

const START_DELAY_MS = 300;
const CHARACTER_DELAY_MS = 36;
const COMMA_DELAY_MS = 90;
const LINE_BREAK_DELAY_MS = 140;

const playedTypewriters = new Set<string>();

const hasPlayedInPageLoad = (sessionKey: string) =>
  playedTypewriters.has(sessionKey);

/**
 * Character-level typewriter for explicitly segmented editorial lines.
 * Highlight metadata stays attached to every revealed character, so selected
 * words retain their semantic accent throughout the animation.
 */
export const TypewriterIntro = ({
  lines,
  sessionKey,
  onComplete,
  className,
}: TypewriterIntroProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [wasPlayedOnMount] = useState(() => hasPlayedInPageLoad(sessionKey));

  const prepared = useMemo(() => {
    const safeLines = Array.isArray(lines)
      ? lines.filter((line): line is TypewriterLine => Array.isArray(line))
      : [];
    let globalStart = 0;
    const preparedLines: PreparedLine[] = safeLines.map((line, lineIndex) => {
      let localStart = 0;
      const segments = line.map((segment) => {
        const result = { ...segment, start: localStart };
        localStart += segment.text.length;
        return result;
      });
      const result = { segments, start: globalStart, length: localStart };
      globalStart += localStart + (lineIndex < safeLines.length - 1 ? 1 : 0);
      return result;
    });

    const text = safeLines
      .map((line) => line.map((segment) => segment.text).join(""))
      .join("\n");

    return { lines: preparedLines, text, length: text.length };
  }, [lines]);

  const skipAnimation = Boolean(prefersReducedMotion) || wasPlayedOnMount;
  const [visibleCount, setVisibleCount] = useState(() =>
    skipAnimation ? prepared.length : 0,
  );
  const [isComplete, setIsComplete] = useState(skipAnimation);
  const didNotifyComplete = useRef(false);

  useEffect(() => {
    const notifyComplete = () => {
      if (didNotifyComplete.current) return;
      didNotifyComplete.current = true;
      onComplete();
    };

    if (skipAnimation) {
      setVisibleCount(prepared.length);
      setIsComplete(true);
      notifyComplete();
      return;
    }

    playedTypewriters.add(sessionKey);
    let timeoutId: number;
    let nextIndex = 0;

    const revealNextCharacter = () => {
      nextIndex += 1;
      setVisibleCount(nextIndex);

      if (nextIndex >= prepared.length) {
        setIsComplete(true);
        notifyComplete();
        return;
      }

      const revealedCharacter = prepared.text[nextIndex - 1];
      const nextDelay =
        revealedCharacter === "\n"
          ? LINE_BREAK_DELAY_MS
          : revealedCharacter === ","
            ? COMMA_DELAY_MS
            : CHARACTER_DELAY_MS;

      timeoutId = window.setTimeout(revealNextCharacter, nextDelay);
    };

    timeoutId = window.setTimeout(revealNextCharacter, START_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [onComplete, prepared.length, prepared.text, sessionKey, skipAnimation]);

  return (
    <p className={className} aria-label={prepared.text}>
      {prepared.lines.map((line, lineIndex) => {
        const visibleInLine = Math.max(
          0,
          Math.min(line.length, visibleCount - line.start),
        );
        const lineEnd = line.start + line.length;
        const isActiveLine =
          !isComplete &&
          visibleCount >= line.start &&
          visibleCount <= lineEnd;

        return (
          <span key={lineIndex} className="block min-h-[1.2em]">
            {line.segments.map((segment, segmentIndex) => {
              const visibleSegmentLength = Math.max(
                0,
                Math.min(segment.text.length, visibleInLine - segment.start),
              );
              if (visibleSegmentLength === 0) return null;

              return (
                <span
                  key={`${lineIndex}-${segmentIndex}`}
                  className={segment.highlight ? "text-accent-blue dark:text-accent-yellow" : undefined}
                  aria-hidden="true"
                >
                  {segment.text.slice(0, visibleSegmentLength)}
                </span>
              );
            })}
            {isActiveLine && (
              <span
                className="typewriter-caret ml-1 inline-block h-[0.85em] w-px bg-foreground align-baseline"
                aria-hidden="true"
              />
            )}
          </span>
        );
      })}
    </p>
  );
};
