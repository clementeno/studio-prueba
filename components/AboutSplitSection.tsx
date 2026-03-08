"use client";

import {useEffect, useMemo, useRef, useState} from "react";

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
  if (difference < 1) return "none";

  return leftHeight < rightHeight ? "left" : "right";
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

  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [stickySide, setStickySide] = useState<StickySide>("none");

  const hasLeftMedia = Boolean(
    (module.leftMediaFileUrl && leftMediaKind) || (!module.leftMediaFileUrl && module.leftImageUrl)
  );
  const hasRightMedia = Boolean(
    (module.rightMediaFileUrl && rightMediaKind) || (!module.rightMediaFileUrl && module.rightImageUrl)
  );
  const hasLeftTail = hasLeftMedia || Boolean(module.leftCredits);
  const hasRightTail = hasRightMedia;

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    let rafId = 0;

    const measure = () => {
      if (rafId) window.cancelAnimationFrame(rafId);

      rafId = window.requestAnimationFrame(() => {
        if (window.matchMedia("(max-width: 760px)").matches) {
          setStickySide("none");
          return;
        }

        const leftHeight = left.offsetHeight;
        const rightHeight = right.offsetHeight;
        const nextSide = getStickySide(leftHeight, rightHeight);

        setStickySide((previous) => (previous === nextSide ? previous : nextSide));
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
    window.addEventListener("resize", onResize);

    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const onMediaChange = () => measure();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onMediaChange);
    } else {
      mediaQuery.addListener(onMediaChange);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
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
    };
  }, []);

  return (
    <section
      className={[
        "aboutModule",
        "aboutModule--split",
        stickySide === "left" ? "aboutModule--split--sticky-left" : "",
        stickySide === "right" ? "aboutModule--split--sticky-right" : "",
      ].join(" ")}
    >
      <div className="aboutSplit__leftCol">
        <div
          ref={leftRef}
          className={`aboutSplit__leftSticky ${
            stickySide === "left" && !hasLeftTail ? "is-sticky-full" : ""
          }`}
        >
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

          {hasLeftTail ? (
            <div
              className={`aboutSplit__tail aboutSplit__leftTail ${
                stickySide === "left" ? "is-sticky-tail" : ""
              }`}
            >
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
          ) : null}
        </div>
      </div>

      <div className="aboutSplit__rightCol">
        <div
          ref={rightRef}
          className={`aboutSplit__rightSticky ${
            stickySide === "right" && !hasRightTail ? "is-sticky-full" : ""
          }`}
        >
          {module.rightTitle ? (
            <h2 className="aboutSplit__sectionTitle">{module.rightTitle}</h2>
          ) : null}

          {rightParagraphs.map((paragraph, index) => (
            <p key={`${module._key}-right-${index}`} className="aboutSplit__body">
              {paragraph}
            </p>
          ))}

          {hasRightTail ? (
            <div
              className={`aboutSplit__tail aboutSplit__rightTail ${
                stickySide === "right" ? "is-sticky-tail" : ""
              }`}
            >
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
          ) : null}
        </div>
      </div>
    </section>
  );
}
