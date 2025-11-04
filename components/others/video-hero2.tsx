'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * VideoHeroWithModal (updated sizing)
 *
 * - Preview video larger on desktop while remaining responsive.
 * - Video fills the rounded container (object-cover), with rounded-lg clipping.
 * - CTA still opens accessible modal with controls.
 */

export default function VideoHeroWithModal2({
  src = '/video/transform2.mov',
  poster = '/video/transform-poster.jpg',
  label = 'Watch Keynote',
}) {
  const [open, setOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  // close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // focus management + attempt play when modal opens
  useEffect(() => {
    if (!open && ctaRef.current) {
      try {
        ctaRef.current.focus();
      } catch (err) {
        /* ignore */
      }
    }

    if (open && modalVideoRef.current) {
      const video = modalVideoRef.current;
      video.currentTime = 0;
      const p = video.play?.();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }, [open]);

  return (
    <>
      {/* Outer wrapper centers the hero */}
      <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-0 md:mt-8">
        {/* Card: responsive max-width, larger height on md/lg, rounded, shadow */}
        <div
          className="relative w-full max-w-5xl rounded-[3.5rem] border border-gray-200/30 shadow-lg overflow-hidden"
          // responsive heights:
          // - small: 420px
          // - md: 520px
          // - lg and up: 640px
          style={{ minHeight: 0 }}
        >
          {/* Set explicit responsive height via Tailwind utility classes on an inner wrapper */}
          <div className="w-full relative bg-gray-900 h-[420px] md:h-[520px] lg:h-[640px]">
            {/* Video fills the wrapper and is clipped by overflow-hidden and the outer rounding */}
            <video
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />

            {/* Optional subtle inner ring to match previous feel (keeps button clickable) */}
            <div className="absolute inset-0 rounded-lg ring-1 ring-white/8 pointer-events-none" />

            {/* Centered CTA button overlay — visually centered horizontally and located slightly above bottom for balance */}
            <div className="absolute inset-8 flex items-start justify-center pb-12 md:pb-14 lg:pb-20 pointer-events-none">
              <div className="pointer-events-auto">
                <button
                  ref={ctaRef}
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/45 text-white font-medium text-[0.9rem] rounded-full shadow-[0_10px_30px_rgba(2,6,23,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:ring-offset-4"
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  aria-controls="video-modal"
                >
                  <span className="text-white">Put Away Dishes</span>
                </button>
              </div>
            </div>

            {/* bottom-left small caption (optional) */}
            <div className="absolute -inset-6 flex flex-col items-center justify-end pb-12 md:pb-14 lg:pb-20 pointer-events-none">
              {/* Decorative; kept commented intentionally */}
              <p className="text-xs text-white/50">Autonomous</p>
              <h2 className="text-base text-white/80">Walk to Kitchen</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - accessible dialog */}
      <div
        id="video-modal"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-60 flex items-center justify-center px-4 sm:px-6 transition-opacity duration-250 ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Modal panel */}
        <div
          className={`relative w-full max-w-4xl mx-auto transform-gpu transition-all duration-300 ${
            open
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-4'
          }`}
          style={{ zIndex: 70 }}
        >
          <div className="bg-transparent rounded-lg overflow-hidden shadow-2xl ring-1 ring-black/20">
            {/* Header with close */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5">
              <div className="text-sm text-white/90 font-medium px-2">
                Keynote
              </div>
              <div className="px-2">
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:bg-white/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Close video"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4 4L16 16M16 4L4 16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal video */}
            <div className="w-full bg-black">
              <video
                ref={modalVideoRef}
                className="w-full h-auto max-h-[85vh] object-contain bg-black"
                src={src}
                poster={poster}
                controls
                playsInline
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5">
              <div className="text-xs text-white/80">
                Presented by 1X • {new Date().getFullYear()}
              </div>
              <div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/90 underline focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
