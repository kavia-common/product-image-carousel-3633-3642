import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Carousel.css";

/**
 * PUBLIC_INTERFACE
 * Carousel component to display a set of text slides with autoplay, navigation dots, and accessibility support.
 *
 * Props:
 * - slides: Array<string | { title?: string, subtitle?: string, description?: string, ctaLabel?: string, ctaHref?: string }>
 *           Backward compatible: if `images` is provided, it will be treated as slides.
 * - autoPlay?: boolean (default: true)
 * - interval?: number in ms (default: 5500)
 * - showDots?: boolean (default: true)
 * - initialIndex?: number (default: 0)
 * - ariaLabel?: string (default: "Content carousel")
 * - loop?: boolean (default: true)
 * - maxHeightVh?: number (default: 60) - maximum height of the carousel viewport as a percentage of the viewport height
 */
function Carousel({
  slides,
  images, // backward compatibility
  autoPlay = true,
  interval = 5500,
  showDots = true,
  initialIndex = 0,
  ariaLabel = "Content carousel",
  loop = true,
  maxHeightVh = 60,
}) {
  // Normalize input: support `slides` (preferred) or `images` (legacy) by converting to text slides
  const input = Array.isArray(slides) ? slides : Array.isArray(images) ? images : [];
  const safeSlides = input.map((s, idx) => {
    if (typeof s === "string") {
      return { description: s };
    }
    // If legacy image objects are passed, convert to description using alt/src
    if (s && typeof s === "object" && ("src" in s || "alt" in s)) {
      return {
        title: s.alt ? `Slide ${idx + 1}` : undefined,
        description: s.alt || `Image slide ${idx + 1}`,
        ctaLabel: undefined,
        ctaHref: undefined,
      };
    }
    // Already an object with text fields
    return s || { description: `Slide ${idx + 1}` };
  });

  const [current, setCurrent] = useState(
    Math.min(Math.max(initialIndex || 0, 0), Math.max(safeSlides.length - 1, 0))
  );
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);
  const focusInsideRef = useRef(false);
  const lastClickTimeRef = useRef(0);

  const count = safeSlides.length;

  const goTo = useCallback(
    (index) => {
      if (!count) return;
      if (index === current) return;
      if (loop) {
        const next = (index + count) % count;
        setCurrent(next);
      } else {
        const clamped = Math.max(0, Math.min(index, count - 1));
        setCurrent(clamped);
      }
    },
    [current, count, loop]
  );

  const goNext = useCallback(() => {
    if (!count) return;
    if (loop) {
      setCurrent((prev) => (prev + 1) % count);
    } else {
      setCurrent((prev) => Math.min(prev + 1, count - 1));
    }
  }, [count, loop]);

  const goPrev = useCallback(() => {
    if (!count) return;
    if (loop) {
      setCurrent((prev) => (prev - 1 + count) % count);
    } else {
      setCurrent((prev) => Math.max(prev - 1, 0));
    }
  }, [count, loop]);

  // Manage autoplay timer
  const clearTimer = useCallback(() => {
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (!autoPlay || isPaused || count <= 1) return;
    clearTimer();
    // Clamp to 5000-6000ms as required
    const clampedInterval = Math.max(5000, Math.min(interval, 6000));
    autoplayRef.current = window.setInterval(() => {
      if (!isPaused && !focusInsideRef.current) {
        goNext();
      }
    }, clampedInterval);
  }, [autoPlay, clearTimer, goNext, interval, isPaused, count]);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer, current]);

  // Pause/resume on hover
  const onMouseEnter = () => setIsPaused(true);
  const onMouseLeave = () => setIsPaused(false);

  // Focus/blur management to pause when focused inside
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleFocusIn = () => {
      focusInsideRef.current = true;
      setIsPaused(true);
    };
    const handleFocusOut = (e) => {
      if (el && !el.contains(e.relatedTarget)) {
        focusInsideRef.current = false;
        setIsPaused(false);
      }
    };

    el.addEventListener("focusin", handleFocusIn);
    el.addEventListener("focusout", handleFocusOut);
    return () => {
      el.removeEventListener("focusin", handleFocusIn);
      el.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Keyboard navigation when the region has focus
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  // Debounce/guard rapid dot clicks
  const canClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 150) {
      return false;
    }
    lastClickTimeRef.current = now;
    return true;
  };

  const slidesStyle = useMemo(
    () => {
      const total = Math.max(1, count);
      return {
        width: `${total * 100}%`,
        transform: `translateX(-${(100 / total) * current}%)`,
      };
    },
    [count, current]
  );

  if (!count) {
    return (
      <div className="op-carousel-empty" role="status" aria-live="polite">
        No slides to display
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className="op-carousel"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live="polite"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ["--op-max-width"]: "min(100%, 1200px)",
        ["--op-card-max-height"]: `min(720px, ${Math.max(40, Math.min(100, maxHeightVh))}vh)`,
        ["--op-viewport-max-height"]: `min(680px, ${Math.max(35, Math.min(100, maxHeightVh - 5))}vh)`,
        ["--op-safe-bottom"]: "max(env(safe-area-inset-bottom, 0px), 0px)",
      }}
    >
      <div className="op-carousel-viewport">
        <div className="op-carousel-track" style={slidesStyle}>
          {safeSlides.map((slide, idx) => {
            const isActive = idx === current;
            const hasCTA = slide && slide.ctaLabel && slide.ctaHref;
            const title = slide?.title;
            const subtitle = slide?.subtitle;
            const description =
              slide?.description ?? (typeof slide === "string" ? slide : "");

            return (
              <div
                key={idx}
                className="op-carousel-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${count}`}
                aria-hidden={!isActive}
                aria-current={isActive ? "true" : undefined}
              >
                <div className="op-slide-panel" role="region" aria-label={title || `Slide ${idx + 1}`}>
                  {subtitle && <p className="op-slide-subtitle">{subtitle}</p>}
                  {title && <h3 className="op-slide-title">{title}</h3>}
                  {description && <p className="op-slide-description">{description}</p>}
                  {hasCTA && (
                    <a
                      className="op-slide-cta"
                      href={slide.ctaHref}
                      aria-label={slide.ctaLabel}
                    >
                      {slide.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDots && (
        <div className="op-carousel-footer" aria-hidden={false}>
          <div
            className="op-carousel-dots"
            role="tablist"
            aria-label="Choose slide"
            style={{ ["--op-safe-bottom"]: "max(env(safe-area-inset-bottom, 0px), 0px)" }}
          >
            {safeSlides.map((_, idx) => {
              const active = idx === current;
              return (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-current={active ? "true" : undefined}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`op-dot ${active ? "active" : ""}`}
                  onClick={() => {
                    if (!canClick()) return;
                    goTo(idx);
                    clearTimer();
                    startTimer();
                  }}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default Carousel;
