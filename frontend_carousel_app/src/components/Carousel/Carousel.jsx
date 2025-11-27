import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Carousel.css";

/**
 * PUBLIC_INTERFACE
 * Carousel component to display a set of product images with autoplay, navigation dots, and accessibility support.
 *
 * Props:
 * - images: Array<{ src: string, alt?: string }>
 * - autoPlay?: boolean (default: true)
 * - interval?: number in ms (default: 4500)
 * - showDots?: boolean (default: true)
 * - initialIndex?: number (default: 0)
 * - ariaLabel?: string (default: "Product image carousel")
 * - loop?: boolean (default: true)
 * - maxHeightVh?: number (default: 60) - maximum height of the carousel viewport as a percentage of the viewport height
 */
function Carousel({
  images,
  autoPlay = true,
  interval = 4500,
  showDots = true,
  initialIndex = 0,
  ariaLabel = "Product image carousel",
  loop = true,
  maxHeightVh = 60,
}) {
  const safeImages = Array.isArray(images) ? images : [];
  const [current, setCurrent] = useState(
    Math.min(Math.max(initialIndex || 0, 0), Math.max(safeImages.length - 1, 0))
  );
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);
  const focusInsideRef = useRef(false);
  const lastClickTimeRef = useRef(0);

  const count = safeImages.length;

  const goTo = useCallback(
    (index) => {
      if (!count) return;
      if (index === current) return;
      // Clamp or loop based on prop
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
    autoplayRef.current = window.setInterval(() => {
      // Only advance if not paused and not focused
      if (!isPaused && !focusInsideRef.current) {
        goNext();
      }
    }, Math.max(1500, interval)); // guard against too-fast interval
  }, [autoPlay, clearTimer, goNext, interval, isPaused, count]);

  // Restart timer whenever dependencies change
  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer, current]);

  // Pause/resume on hover
  const onMouseEnter = () => {
    setIsPaused(true);
  };
  const onMouseLeave = () => {
    setIsPaused(false);
  };

  // Focus/blur management to pause when focused inside
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleFocusIn = () => {
      focusInsideRef.current = true;
      setIsPaused(true);
    };
    const handleFocusOut = (e) => {
      // If focus left the container completely
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
    () => ({
      width: `${count * 100}%`,
      transform: `translateX(-${(100 / (count || 1)) * current}%)`,
    }),
    [count, current]
  );

  if (!count) {
    return (
      <div className="op-carousel-empty" role="status" aria-live="polite">
        No images to display
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className="op-carousel"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        // Expose tunable sizing via CSS variables
        // Cap width and provide dynamic height caps that downstream CSS consumes
        // Use min() to ensure it never exceeds viewport and a sensible pixel max
        ["--op-max-width"]: "min(100%, 1200px)",
        ["--op-card-max-height"]: `min(720px, ${Math.max(40, Math.min(100, maxHeightVh))}vh)`,
        ["--op-viewport-max-height"]:`min(680px, ${Math.max(35, Math.min(100, maxHeightVh - 5))}vh)`,
        // Account for safe areas on mobile so dots remain visible
        ["--op-safe-bottom"]: "max(env(safe-area-inset-bottom, 0px), 0px)",
      }}
    >
      <div className="op-carousel-viewport">
        <div className="op-carousel-track" style={slidesStyle}>
          {safeImages.map((img, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={idx}
                className="op-carousel-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${count}`}
                aria-hidden={!isActive}
              >
                <img
                  className="op-carousel-image"
                  src={img.src}
                  alt={img.alt || `Product image ${idx + 1}`}
                  loading="lazy"
                  sizes="100vw"
                  draggable="false"
                />
              </div>
            );
          })}
        </div>
      </div>

      {showDots && (
        <div className="op-carousel-dots" role="tablist" aria-label="Choose slide">
          {safeImages.map((_, idx) => {
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
                  // reset autoplay timer
                  clearTimer();
                  startTimer();
                }}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Carousel;
