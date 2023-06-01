'use client';
import React, { useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

export default function Morph({ texts }: { texts: string[] }): JSX.Element {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const morphTime = 3;
  const cooldownTime = 0.8;

  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;

  useEffect(() => {
    const elts = {
      text1: text1Ref.current,
      text2: text2Ref.current
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    const debouncedDoMorph = debounce(doMorph, 5, {
      leading: true,
      trailing: false
    }); // Debounced version of doMorph, executed at most every 16ms, with leading edge execution

    const setMorph = (fraction: number) => {
      if (elts.text2) {
        elts.text2.style.filter = `blur(${Math.min(8 / fraction - 10, 100)}px)`;
        elts.text2.style.opacity = `${Math.pow(fraction, 0.7) * 100}%`;
      }

      fraction = 1 - fraction;

      if (elts.text1) {
        elts.text1.style.filter = `blur(${Math.min(8 / fraction - 10, 100)}px)`;
        elts.text1.style.opacity = `${Math.pow(fraction, 0.7) * 100}%`;
        elts.text1.textContent = texts[textIndex % texts.length];
      }

      if (elts.text2) {
        elts.text2.textContent = texts[(textIndex + 1) % texts.length];
      }
    };

    const doCooldown = () => {
      morph = 0;

      if (elts.text2) {
        elts.text2.style.filter = '';
        elts.text2.style.opacity = '100%';
      }

      if (elts.text1) {
        elts.text1.style.filter = '';
        elts.text1.style.opacity = '0%';
      }
    };

    const animate = () => {
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000; // Using getTime() to get numeric values
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }

        debouncedDoMorph();
      } else {
        doCooldown();
      }
    };

    let animationFrame: number;

    const startAnimation = () => {
      animationFrame = requestAnimationFrame(startAnimation);
      animate();
    };

    startAnimation();

    return () => {
      cancelAnimationFrame(animationFrame);
      debouncedDoMorph.cancel();
      cancelAnimationFrame(startAnimation); // Add this line to cancel the pending animation frames
    };
  }, []);

  return (
    <>
      <div id="container">
        <span id="text1" ref={text1Ref}></span>
        <span id="text2" ref={text2Ref}></span>
      </div>
      <svg id="filters">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
