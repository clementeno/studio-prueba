"use client";

import {useEffect, useMemo, useState} from "react";

const INTRO_STORAGE_KEY = "home_intro_seen_v3";
const TOTAL_DURATION_MS = 2800;
const START_DELAY_MS = 220;
const HOLD_AFTER_TYPING_MS = 650;
const FADE_OUT_MS = 700;

export default function HomeIntroOverlay() {
  const fullText = useMemo(() => "MÁS / MENOS / STUDIO", []);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let typingTimer: number | null = null;
    let closeTimer: number | null = null;
    let finishTimer: number | null = null;
    let startTimer: number | null = null;

    const alreadySeen = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";

    if (alreadySeen) {
      return;
    }

    const typingWindowMs =
      TOTAL_DURATION_MS - START_DELAY_MS - HOLD_AFTER_TYPING_MS - FADE_OUT_MS;
    const typingIntervalMs = Math.max(
      45,
      Math.floor(typingWindowMs / Math.max(fullText.length, 1))
    );

    setVisible(true);
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");

    startTimer = window.setTimeout(() => {
      let index = 0;

      typingTimer = window.setInterval(() => {
        index += 1;
        setTypedText(fullText.slice(0, index));

        if (index >= fullText.length) {
          if (typingTimer) window.clearInterval(typingTimer);
          closeTimer = window.setTimeout(() => {
            setClosing(true);
            finishTimer = window.setTimeout(() => setVisible(false), FADE_OUT_MS);
          }, HOLD_AFTER_TYPING_MS);
        }
      }, typingIntervalMs);
    }, START_DELAY_MS);

    return () => {
      if (startTimer) window.clearTimeout(startTimer);
      if (typingTimer) window.clearInterval(typingTimer);
      if (closeTimer) window.clearTimeout(closeTimer);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, [fullText]);

  if (!visible) return null;

  return (
    <div className={`homeIntro ${closing ? "is-closing" : ""}`} aria-hidden="true">
      <p className="homeIntro__text">
        {typedText}
        <span className="homeIntro__cursor" />
      </p>
    </div>
  );
}
