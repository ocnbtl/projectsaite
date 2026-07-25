"use client";

import { useEffect, useMemo, useState } from "react";

const scrambleAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const naturalTypingCadence = [82, 118, 74, 132, 91, 109, 78, 124, 88];

function typingDelayAfter(kicker: string, characterIndex: number) {
  if (kicker.startsWith("Hi,") && characterIndex === 0) return 44;
  if (kicker.startsWith("Hi,") && characterIndex === 1) return 38;
  if (kicker.startsWith("Hi,") && characterIndex === 2) return 230;
  if (kicker[characterIndex] === " ") return 65;
  return naturalTypingCadence[characterIndex % naturalTypingCadence.length];
}

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
  const [showCaret, setShowCaret] = useState(true);
  const [titleHasStarted, setTitleHasStarted] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => {
        setTypedKicker(kicker);
        setScrambledTitle(title);
        setShowCaret(false);
        setTitleHasStarted(true);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    let typeIndex = 0;
    let scrambleTick = 0;
    const timers: number[] = [];

    const startScramble = () => {
      setTitleHasStarted(true);
      const warmupTicks = 3;
      const ticksPerCharacter = 3;
      const scrambleTimer = window.setInterval(() => {
        scrambleTick += 1;
        const lockedCharacters = Math.min(
          Math.max(0, Math.floor((scrambleTick - warmupTicks) / ticksPerCharacter)),
          characterCount,
        );
        setScrambledTitle(scrambleTitle(title, lockedCharacters, scrambleTick));
        if (lockedCharacters >= characterCount) {
          window.clearInterval(scrambleTimer);
          setScrambledTitle(title);
        }
      }, 50);
      timers.push(scrambleTimer);
    };

    const typeNextCharacter = () => {
      typeIndex += 1;
      setTypedKicker(kicker.slice(0, typeIndex));

      if (typeIndex < kicker.length) {
        const typingTimer = window.setTimeout(
          typeNextCharacter,
          typingDelayAfter(kicker, typeIndex - 1),
        );
        timers.push(typingTimer);
      } else {
        const scrambleStart = window.setTimeout(startScramble, 120);
        const caretEnd = window.setTimeout(() => setShowCaret(false), 360);
        timers.push(scrambleStart, caretEnd);
      }
    };

    const typingStart = window.setTimeout(typeNextCharacter, 90);
    timers.push(typingStart);

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [characterCount, kicker, title]);

  return (
    <>
      <p className="editorial-hero__intro" aria-hidden="true">
        {typedKicker}
        {showCaret ? (
          <span className="editorial-hero__typing-caret" aria-hidden="true" />
        ) : null}
      </p>
      <h1 className={titleHasStarted ? "is-scrambling" : "is-waiting"} aria-label={`${kicker} ${title}`}>
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
