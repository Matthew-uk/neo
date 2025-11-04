// components/VideoCarousel.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Slide = {
  id: string | number;
  src: string;
  poster?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
};

const DEFAULT_AUTOPLAY_MS = 6000;

export default function VideoCarousel({
  slides,
  autoplay = true,
  autoplayMs = DEFAULT_AUTOPLAY_MS,
  height = '60vh',
}: {
  slides: Slide[];
  autoplay?: boolean;
  autoplayMs?: number;
  height?: string | number;
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autoplay timer
  useEffect(() => {
    if (!autoplay) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => next(), autoplayMs);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoplay, autoplayMs]);

  // manage actual playback using refs when active index changes
  useEffect(() => {
    const vids = videoRefs.current;
    vids.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        // play active video
        // some browsers return a promise; ignore errors (autoplay policy)
        const playPromise = v.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch((err) => {
            // mostly autoplay-block errors — we swallow so app doesn't crash
            // optionally you could show a play button to unmute / start
            // console.debug('Video play() rejected', err);
          });
        }
      } else {
        // pause non-active videos to stop decoding / audio
        try {
          v.pause();
          // Optionally reset time so they start from 0 when shown again:
          // v.currentTime = 0;
        } catch (e) {
          // ignore
        }
      }
    });
  }, [index]);

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function prev() {
    clearTimer();
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    clearTimer();
    setIndex((i) => (i + 1) % slides.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  }

  return (
    <div className="w-full relative">
      <div className="video-top-fade" />

      <div
        className="relative w-full overflow-hidden rounded-b-2xl"
        style={{ height }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((s, i) => {
          const active = i === index;

          return (
            <div
              key={s.id}
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden={!active}
              style={{
                opacity: active ? 1 : 0,
                transform: active ? 'translateX(0)' : 'translateX(6%)',
                zIndex: active ? 10 : 5,
              }}
            >
              <video
                // store ref so we can call play() when active
                ref={(el) => {
                  if (el) videoRefs.current[i] = el;
                }}
                className="w-full h-full object-cover video-slide"
                // preload metadata so browser can prepare (change to "auto" if you want)
                preload="metadata"
                // keep these for autoplay policy
                playsInline
                muted
                loop
                poster={s.poster}
                // keep src always set; if you want true lazy-loading,
                // replace `src={s.src}` with:
                // src={active || i === index + 1 || i === index - 1 ? s.src : undefined}
                // so only active+adjacent slides load. For simplicity we set it always:
                src={s.src}
              />
            </div>
          );
        })}

        {/* Top pill */}
        <div className="absolute z-30 left-1/2 transform -translate-x-1/2 top-8">
          <div className="inline-flex items-center gap-3 bg-black/70 text-white px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
            <button
              onClick={prev}
              aria-label="Previous"
              className="p-1 rounded-full hover:bg-white/10 focus:outline-none"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="text-sm font-medium select-none">
              {slides[index].alt ?? `Slide ${index + 1}`}
            </div>
            <button
              onClick={next}
              aria-label="Next"
              className="p-1 rounded-full hover:bg-white/10 focus:outline-none"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* Center Pill */}
        {slides?.map((slide, index) => (
          <div className="absolute z-30 left-1/2 transform -translate-x-1/2 top-52">
            <h2 className="text-white text-center md:text-5xl text-2xl">
              {slide.title}
            </h2>
            <p className="text-white text-center md:text-2xl text-xl mt-4">
              {slide.subtitle}
            </p>
          </div>
        ))}

        <div className="absolute right-6 bottom-6 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                clearTimer();
                setIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? 'scale-125 bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="video-bottom-fade" />
    </div>
  );
}
