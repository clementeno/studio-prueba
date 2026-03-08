"use client";

import {useEffect, useMemo, useRef} from "react";

type AboutSplitModule = {
  _key: string;
  leftTitle?: string;
  leftBody?: string;
  leftCredits?: string;
  leftImageUrl?: string;
  leftMediaFileUrl?: string;
  leftMediaFileMimeType?: string;
  leftMediaAlt?: string;
  leftMediaFit?: "cover" | "contain";
  rightTitle?: string;
  rightBody?: string;
  rightImageUrl?: string;
  rightMediaFileUrl?: string;
  rightMediaFileMimeType?: string;
  rightMediaAlt?: string;
  rightMediaFit?: "cover" | "contain";
};

type StickySide = "left" | "right" | "none";

type StickyMetrics = {
  side: StickySide;
  start: number;
  maxShift: number;
};

function splitParagraphs(value?: string) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getMediaKind(mimeType?: string, mediaUrl?: string) {
  const mime = (mimeType || "").toLowerCase();
  const url = (mediaUrl || "").toLowerCase();

  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) return "video";
  if (url.endsWith(".gif")) return "image";

  return null;
}

function getStickySide(leftHeight: number, rightHeight: number) {
  const difference = Math.abs(leftHeight - rightHeight);
  if (difference < 2) return "none";

  return leftHeight < rightHeight ? "left" : "right";
}

function getStickyTopOffset() {
  const headerHeightVar = getComputedStyle(document.documentElement).getPropertyValue("--headerH");
  const parsedHeaderHeight = Number.parseFloat(headerHeightVar);
  const headerHeight = Number.isFinite(parsedHeaderHeight) ? parsedHeaderHeight : 62;

  return headerHeight + 18;
}

export default function AboutSplitSection({module}: {module: AboutSplitModule}) {
  const leftParagraphs = useMemo(() => splitParagraphs(module.leftBody), [module.leftBody]);
  const rightParagraphs = useMemo(() => splitParagraphs(module.rightBody), [module.rightBody]);
  const leftMediaKind = useMemo(
    () => getMediaKind(module.leftMediaFileMimeType, module.leftMediaFileUrl),
    [module.leftMediaFileMimeType, module.leftMediaFileUrl]
  );
  const rightMediaKind = useMemo(
    () => getMediaKind(module.rightMediaFileMimeType, module.rightMediaFileUrl),
    [module.rightMediaFileMimeType, module.rightMediaFileUrl]
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<StickyMetrics>({side: "none", start: 0, maxShift: 0});

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    let measureRafId = 0;
    let scrollRafId = 0;

    const resetTransforms = () => {
      left.style.transform = "";
      right.style.transform = "";
      section.dataset.stickySide = "none";
    };

    const applyShift = () => {
      const metrics = metricsRef.current;

      if (metrics.side === "none" || window.matchMedia("(max-width: 760px)").matches) {
        resetTransforms();
        return;
      }

      const y = window.scrollY;
      const shift = Math.max(0, Math.min(metrics.maxShift, y - metrics.start));
      const translate = shift > 0 ? `translate3d(0, ${shift}px, 0)` : "";

      if (metrics.side === "left") {
        left.style.transform = translate;
        right.style.transform = "";
      } else {
        left.style.transform = "";
        right.style.transform = translate;
      }
    };

    const measure = () => {
      if (measureRafId) window.cancelAnimationFrame(measureRafId);

      measureRafId = window.requestAnimationFrame(() => {
        if (window.matchMedia("(max-width: 760px)").matches) {
          metricsRef.current = {side: "none", start: 0, maxShift: 0};
          resetTransforms();
          return;
        }

        const leftHeight = left.offsetHeight;
        const rightHeight = right.offsetHeight;
        const side = getStickySide(leftHeight, rightHeight);

        if (side === "none") {
          metricsRef.current = {side: "none", start: 0, maxShift: 0};
          resetTransforms();
          return;
        }

        const shortHeight = side === "left" ? leftHeight : rightHeight;
        const longHeight = side === "left" ? rightHeight : leftHeight;
        const stickyTop = getStickyTopOffset();
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const start = sectionTop + shortHeight - stickyTop;
        const maxShift = Math.max(0, longHeight - shortHeight);

        metricsRef.current = {side, start, maxShift};
        section.dataset.stickySide = side;
        applyShift();
      });
    };

    measure();
    const delayedMeasureId = window.setTimeout(measure, 220);

    if ("fonts" in document) {
      // Recalcula después de cargar fuentes para evitar alturas inestables.
      document.fonts.ready.then(() => measure()).catch(() => {});
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(left);
      resizeObserver.observe(right);
    }

    const mediaElements = [
      ...Array.from(left.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img,video")),
      ...Array.from(right.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img,video")),
    ];
    const onMediaReady = () => measure();

    mediaElements.forEach((element) => {
      element.addEventListener("load", onMediaReady);
      element.addEventListener("loadeddata", onMediaReady);
    });

    const onResize = () => measure();
    const onScroll = () => {
      if (scrollRafId) return;

      scrollRafId = window.requestAnimationFrame(() => {
        scrollRafId = 0;
        applyShift();
      });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, {passive: true});

    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const onMediaChange = () => measure();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onMediaChange);
    } else {
      mediaQuery.addListener(onMediaChange);
    }

    return () => {
      if (measureRafId) window.cancelAnimationFrame(measureRafId);
      if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(delayedMeasureId);
      mediaElements.forEach((element) => {
        element.removeEventListener("load", onMediaReady);
        element.removeEventListener("loadeddata", onMediaReady);
      });
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", onMediaChange);
      } else {
        mediaQuery.removeListener(onMediaChange);
      }

      resetTransforms();
    };
  }, []);

  return (
    <section ref={sectionRef} className="aboutModule aboutModule--split">
      <div className="aboutSplit__leftCol">
        <div ref={leftRef} className="aboutSplit__leftSticky aboutSplit__stickyTarget">
          {module.leftTitle ? <h2 className="aboutSplit__sectionTitle">{module.leftTitle}</h2> : null}

          {leftParagraphs.length > 0 ? (
            <div className="aboutSplit__leftBody">
              {leftParagraphs.map((paragraph, index) => (
                <p key={`${module._key}-left-${index}`} className="aboutSplit__lead">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {module.leftMediaFileUrl && leftMediaKind === "video" ? (
            <video
              className={`aboutSplit__media aboutSplit__media--${module.leftMediaFit || "cover"}`}
              src={module.leftMediaFileUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : null}

          {module.leftMediaFileUrl && leftMediaKind === "image" ? (
            <img
              className={`aboutSplit__media aboutSplit__media--${module.leftMediaFit || "cover"}`}
              src={module.leftMediaFileUrl}
              alt={module.leftMediaAlt || ""}
              loading="lazy"
            />
          ) : null}

          {!module.leftMediaFileUrl && module.leftImageUrl ? (
            <img
              className={`aboutSplit__media aboutSplit__media--${module.leftMediaFit || "cover"}`}
              src={`${module.leftImageUrl}?w=2200&fit=max&auto=format`}
              alt={module.leftMediaAlt || ""}
              loading="lazy"
            />
          ) : null}

          {module.leftCredits ? (
            <div className="aboutSplit__creditsWrap">
              <h3 className="aboutSplit__metaLabel">Créditos</h3>
              <p className="aboutSplit__credits">{module.leftCredits}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="aboutSplit__rightCol">
        <div ref={rightRef} className="aboutSplit__rightSticky aboutSplit__stickyTarget">
          {module.rightTitle ? (
            <h2 className="aboutSplit__sectionTitle">{module.rightTitle}</h2>
          ) : null}

          {rightParagraphs.map((paragraph, index) => (
            <p key={`${module._key}-right-${index}`} className="aboutSplit__body">
              {paragraph}
            </p>
          ))}

          {module.rightMediaFileUrl && rightMediaKind === "video" ? (
            <video
              className={`aboutSplit__media aboutSplit__media--${module.rightMediaFit || "cover"}`}
              src={module.rightMediaFileUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : null}

          {module.rightMediaFileUrl && rightMediaKind === "image" ? (
            <img
              className={`aboutSplit__media aboutSplit__media--${module.rightMediaFit || "cover"}`}
              src={module.rightMediaFileUrl}
              alt={module.rightMediaAlt || ""}
              loading="lazy"
            />
          ) : null}

          {!module.rightMediaFileUrl && module.rightImageUrl ? (
            <img
              className={`aboutSplit__media aboutSplit__media--${module.rightMediaFit || "cover"}`}
              src={`${module.rightImageUrl}?w=2200&fit=max&auto=format`}
              alt={module.rightMediaAlt || ""}
              loading="lazy"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
