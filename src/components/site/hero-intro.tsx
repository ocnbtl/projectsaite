"use client";

import { useEffect, useMemo, useState } from "react";

const scrambleAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function scrambleTitle(title: string, lockedCharacters: number, tick: number) {
  let visibleCharacter = 0;

  return title
    .split("")
    .map((character, index) => {
      if (character === " ") return character;
      const result = visibleCharacter < lockedCharacters
        ? character
        : scrambleAlphabet[(index * 7 + tick * 5) % scrambleAlphabet.length];
      visibleCharacter += 1;
      return result;
    })
    .join("");
}

export function HeroIntro({ kicker, title }: { kicker: string; title: string }) {
  const characterCount = useMemo(() => title.replace(/\s/g, "").length, [title]);
  const [typedKicker, setTypedKicker] = useState("");
  const [scrambledTitle, setScrambledTitle] = useState(() => scrambleTitle(title, 0, 0));

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => {
        setTypedKicker(kicker);
        setScrambledTitle(title);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    let typeIndex = 0;
    let scrambleTick = 0;
    const timers: number[] = [];

    const typingTimer = window.setInterval(() => {
      typeIndex += 1;
      setTypedKicker(kicker.slice(0, typeIndex));
      if (typeIndex >= kicker.length) window.clearInterval(typingTimer);
    }, Math.max(12, Math.floor(240 / Math.max(kicker.length, 1))));
    timers.push(typingTimer);

    const scrambleStart = window.setTimeout(() => {
      const scrambleTimer = window.setInterval(() => {
        scrambleTick += 1;
        const progress = Math.min(scrambleTick / 18, 1);
        const lockedCharacters = Math.floor(progress * characterCount);
        setScrambledTitle(scrambleTitle(title, lockedCharacters, scrambleTick));
        if (progress >= 1) {
          window.clearInterval(scrambleTimer);
          setScrambledTitle(title);
        }
      }, 32);
      timers.push(scrambleTimer);
    }, 210);
    timers.push(scrambleStart);

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [characterCount, kicker, title]);

  return (
    <>
      <p className="editorial-hero__intro" aria-hidden="true">
        {typedKicker}
        {typedKicker.length < kicker.length ? (
          <span className="editorial-hero__typing-caret" aria-hidden="true" />
        ) : null}
      </p>
      <h1 aria-label={`${kicker} ${title}`}>
        <span className="editorial-visually-hidden">{kicker} {title}</span>
        {scrambledTitle.split(/\s+/).map((part, index) => (
          <span className="editorial-hero__name-word" aria-hidden="true" key={index}>
            {part}
          </span>
        ))}
      </h1>
    </>
  );
}
