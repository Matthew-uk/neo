import React, { useState, useEffect, useRef } from 'react';

/**
 * ResponsiveNavbar (fixed + animated mobile panel)
 * - Fixed navbar (stays at top)
 * - Mobile menu is always in DOM; visibility controlled via classes so open/close animates smoothly.
 * - Body scroll is locked while menu is open.
 * - Escape closes menu. Focus returns to hamburger when closed. When opened, first link receives focus.
 *
 * Note: Tailwind must include utilities for transform/opacity/translate/scale/transition/duration/ease.
 */

export default function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const firstLinkRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    function onKey(e: any) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // body scroll lock while open
  useEffect(() => {
    const original = document.documentElement.style.overflow;
    if (open) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = original || '';
    }
    return () => {
      document.documentElement.style.overflow = original || '';
    };
  }, [open]);

  // return focus to hamburger when panel closes
  useEffect(() => {
    if (!open && buttonRef.current) {
      (buttonRef.current as HTMLButtonElement | null)?.focus();
    }
  }, [open]);

  // when opening, focus the first link after animation start
  useEffect(() => {
    if (open) {
      // small delay to wait for the panel to become visible (animation start)
      const id = window.setTimeout(() => {
        if (firstLinkRef.current)
          (firstLinkRef.current as HTMLButtonElement | null)?.focus();
      }, 180);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const navLinks = [
    { label: 'NEO', href: '/neo' },
    { label: 'AI', href: '/ai' },
    { label: 'Stories', href: '/stories' },
    { label: 'Careers', href: '/careers' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top bar with subtle border and backdrop so it sits on hero image */}
      <div className="backdrop-blur-none bg-transparent border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="h-16 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center">
              <a href="/" aria-label="Home" className="flex items-center gap-3">
                {/* SVG logo (kept same design) */}
                <svg
                  className="w-[28px] h-[20px] transition-colors duration-300 relative z-1"
                  width="26"
                  height="16"
                  viewBox="0 0 26 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.699 15.1299C25.6859 15.5128 25.5403 15.7825 25.248 15.9137C24.8209 16.1058 24.5071 15.8624 24.2196 15.5713C22.9454 14.2756 21.6724 12.98 20.3934 11.689C18.574 9.85052 17.3606 9.84217 15.5627 11.6556C14.3135 12.9155 13.0679 14.1778 11.8236 15.4413C11.4501 15.8207 11.0421 16.274 10.51 15.7884C9.923 15.2528 10.3573 14.7922 10.7725 14.3723C12.2328 12.8952 13.6597 11.386 15.1534 9.94358C16.7343 8.41525 18.8723 8.25538 20.4316 9.67037C22.1604 11.2381 23.7448 12.9621 25.3829 14.6264C25.5284 14.7743 25.6083 14.9843 25.6978 15.1299H25.699Z"
                    fill="#F7F7F7"
                  ></path>
                  <path
                    d="M17.9015 7.21649C16.8504 7.22842 15.9508 6.85022 15.2147 6.11648C13.715 4.62036 12.2308 3.10993 10.7407 1.60427C10.3625 1.2213 9.95442 0.781053 10.4328 0.276382C10.9888 -0.311803 11.4362 0.170199 11.8419 0.580616C13.1769 1.93476 14.4965 3.3056 15.8506 4.64065C17.2536 6.02342 18.6543 6.027 20.0514 4.65258C21.3769 3.34974 22.6618 2.00634 23.973 0.689186C24.387 0.272803 24.8273 -0.370264 25.4668 0.27161C26.0263 0.834741 25.4859 1.28453 25.0933 1.68302C23.6688 3.13141 22.2383 4.57383 20.809 6.01745C20.0108 6.82397 19.054 7.25706 17.9015 7.2153V7.21649Z"
                    fill="#F7F7F7"
                  ></path>
                  <path
                    d="M7.46868 2.38692C7.47703 3.1648 7.48419 3.93911 7.2933 4.70506C6.91032 6.24532 5.94751 7.16637 4.381 7.46822C3.26071 7.68297 2.12967 7.57917 1.00222 7.5911C0.478458 7.59468 0.00480805 7.42169 3.57557e-05 6.81919C-0.00473654 6.19998 0.468914 6.07829 0.997445 6.08187C1.77891 6.08783 2.56276 6.1105 3.34184 6.07351C4.9501 5.99716 5.89143 5.04151 5.94751 3.4404C5.97614 2.62076 5.95944 1.79992 5.95347 0.97909C5.9499 0.42789 6.15868 0.0127 6.75761 0.0425268C7.27779 0.0675813 7.46271 0.476806 7.46629 0.96C7.46987 1.43484 7.46629 1.90969 7.46629 2.38453L7.46868 2.38692Z"
                    fill="#F7F7F7"
                  ></path>
                  <path
                    d="M5.95483 12.205C5.95483 11.2577 5.95483 10.3104 5.95483 9.36312C5.95483 8.88589 6.09204 8.47666 6.63727 8.44206C7.26006 8.4015 7.46169 8.83936 7.46527 9.36431C7.4772 11.2589 7.47839 13.1535 7.46527 15.0469C7.46169 15.5707 7.25648 16.0121 6.63727 15.9704C6.0992 15.9346 5.95483 15.5253 5.95603 15.0457C5.95961 14.0984 5.95603 13.1511 5.95603 12.2038L5.95483 12.205Z"
                    fill="#F7F7F7"
                  ></path>
                </svg>
                <svg
                  className="w-[28px] h-[20px] transition-opacity duration-300 opacity-0 absolute z-2 inset-0"
                  width="26"
                  height="16"
                  viewBox="0 0 26 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.699 15.1299C25.6859 15.5128 25.5403 15.7825 25.248 15.9137C24.8209 16.1058 24.5071 15.8624 24.2196 15.5713C22.9454 14.2756 21.6724 12.98 20.3934 11.689C18.574 9.85052 17.3606 9.84217 15.5627 11.6556C14.3135 12.9155 13.0679 14.1778 11.8236 15.4413C11.4501 15.8207 11.0421 16.274 10.51 15.7884C9.923 15.2528 10.3573 14.7922 10.7725 14.3723C12.2328 12.8952 13.6597 11.386 15.1534 9.94358C16.7343 8.41525 18.8723 8.25538 20.4316 9.67037C22.1604 11.2381 23.7448 12.9621 25.3829 14.6264C25.5284 14.7743 25.6083 14.9843 25.6978 15.1299H25.699Z"
                    fill="#41403C"
                  ></path>
                  <path
                    d="M17.9015 7.21649C16.8504 7.22842 15.9508 6.85022 15.2147 6.11648C13.715 4.62036 12.2308 3.10993 10.7407 1.60427C10.3625 1.2213 9.95442 0.781053 10.4328 0.276382C10.9888 -0.311803 11.4362 0.170199 11.8419 0.580616C13.1769 1.93476 14.4965 3.3056 15.8506 4.64065C17.2536 6.02342 18.6543 6.027 20.0514 4.65258C21.3769 3.34974 22.6618 2.00634 23.973 0.689186C24.387 0.272803 24.8273 -0.370264 25.4668 0.27161C26.0263 0.834741 25.4859 1.28453 25.0933 1.68302C23.6688 3.13141 22.2383 4.57383 20.809 6.01745C20.0108 6.82397 19.054 7.25706 17.9015 7.2153V7.21649Z"
                    fill="#41403C"
                  ></path>
                  <path
                    d="M7.46868 2.38692C7.47703 3.1648 7.48419 3.93911 7.2933 4.70506C6.91032 6.24532 5.94751 7.16637 4.381 7.46822C3.26071 7.68297 2.12967 7.57917 1.00222 7.5911C0.478458 7.59468 0.00480805 7.42169 3.57557e-05 6.81919C-0.00473654 6.19998 0.468914 6.07829 0.997445 6.08187C1.77891 6.08783 2.56276 6.1105 3.34184 6.07351C4.9501 5.99716 5.89143 5.04151 5.94751 3.4404C5.97614 2.62076 5.95944 1.79992 5.95347 0.97909C5.9499 0.42789 6.15868 0.0127 6.75761 0.0425268C7.27779 0.0675813 7.46271 0.476806 7.46629 0.96C7.46987 1.43484 7.46629 1.90969 7.46629 2.38453L7.46868 2.38692Z"
                    fill="#41403C"
                  ></path>
                  <path
                    d="M5.95483 12.205C5.95483 11.2577 5.95483 10.3104 5.95483 9.36312C5.95483 8.88589 6.09204 8.47666 6.63727 8.44206C7.26006 8.4015 7.46169 8.83936 7.46527 9.36431C7.4772 11.2589 7.47839 13.1535 7.46527 15.0469C7.46169 15.5707 7.25648 16.0121 6.63727 15.9704C6.0992 15.9346 5.95483 15.5253 5.95603 15.0457C5.95961 14.0984 5.95603 13.1511 5.95603 12.2038L5.95483 12.205Z"
                    fill="#41403C"
                  ></path>
                </svg>
              </a>
            </div>

            {/* Center: nav links (only on lg and up). Centered and spaced like screenshot. */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
              <ul className="flex gap-10 text-sm tracking-wide text-gray-200/90 items-center">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="py-2 px-1 hover:text-white transition-colors relative"
                    >
                      {link.label}
                      <span className="absolute left-0 right-0 -bottom-3 h-px bg-transparent group-hover:bg-white" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side: ORDER button or hamburger */}
            <div className="flex items-center gap-4">
              <a
                href="/order"
                className="hidden lg:inline-block text-sm tracking-wide py-2 px-3 border border-transparent hover:bg-white/10 rounded-md text-gray-100"
                aria-label="Place order"
              >
                ORDER
              </a>

              {/* Hamburger for small screens */}
              <button
                ref={buttonRef}
                onClick={() => setOpen(true)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label="Open menu"
              >
                <svg
                  width="22"
                  height="14"
                  viewBox="0 0 22 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect
                    width="22"
                    height="2"
                    rx="1"
                    fill="rgba(255,255,255,0.95)"
                  />
                  <rect
                    y="6"
                    width="22"
                    height="2"
                    rx="1"
                    fill="rgba(255,255,255,0.95)"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile full-screen panel (always in DOM to animate) */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        // animate open/close: translateY + scale + opacity for a subtle pop from top
        className={`fixed inset-0 z-50 flex flex-col bg-white text-gray-800
          transform-gpu transition-all duration-300 ease-out will-change-transform
          ${
            open
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
          }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          {/* Logo small */}
          <a href="/" aria-label="Home" className="flex items-center gap-3">
            <svg
              className="w-[28px] h-[20px] transition-colors duration-300 relative z-1"
              width="26"
              height="16"
              viewBox="0 0 26 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.699 15.1299C25.6859 15.5128 25.5403 15.7825 25.248 15.9137C24.8209 16.1058 24.5071 15.8624 24.2196 15.5713C22.9454 14.2756 21.6724 12.98 20.3934 11.689C18.574 9.85052 17.3606 9.84217 15.5627 11.6556C14.3135 12.9155 13.0679 14.1778 11.8236 15.4413C11.4501 15.8207 11.0421 16.274 10.51 15.7884C9.923 15.2528 10.3573 14.7922 10.7725 14.3723C12.2328 12.8952 13.6597 11.386 15.1534 9.94358C16.7343 8.41525 18.8723 8.25538 20.4316 9.67037C22.1604 11.2381 23.7448 12.9621 25.3829 14.6264C25.5284 14.7743 25.6083 14.9843 25.6978 15.1299H25.699Z"
                fill="#000"
              ></path>
              <path
                d="M17.9015 7.21649C16.8504 7.22842 15.9508 6.85022 15.2147 6.11648C13.715 4.62036 12.2308 3.10993 10.7407 1.60427C10.3625 1.2213 9.95442 0.781053 10.4328 0.276382C10.9888 -0.311803 11.4362 0.170199 11.8419 0.580616C13.1769 1.93476 14.4965 3.3056 15.8506 4.64065C17.2536 6.02342 18.6543 6.027 20.0514 4.65258C21.3769 3.34974 22.6618 2.00634 23.973 0.689186C24.387 0.272803 24.8273 -0.370264 25.4668 0.27161C26.0263 0.834741 25.4859 1.28453 25.0933 1.68302C23.6688 3.13141 22.2383 4.57383 20.809 6.01745C20.0108 6.82397 19.054 7.25706 17.9015 7.2153V7.21649Z"
                fill="#000"
              ></path>
              <path
                d="M7.46868 2.38692C7.47703 3.1648 7.48419 3.93911 7.2933 4.70506C6.91032 6.24532 5.94751 7.16637 4.381 7.46822C3.26071 7.68297 2.12967 7.57917 1.00222 7.5911C0.478458 7.59468 0.00480805 7.42169 3.57557e-05 6.81919C-0.00473654 6.19998 0.468914 6.07829 0.997445 6.08187C1.77891 6.08783 2.56276 6.1105 3.34184 6.07351C4.9501 5.99716 5.89143 5.04151 5.94751 3.4404C5.97614 2.62076 5.95944 1.79992 5.95347 0.97909C5.9499 0.42789 6.15868 0.0127 6.75761 0.0425268C7.27779 0.0675813 7.46271 0.476806 7.46629 0.96C7.46987 1.43484 7.46629 1.90969 7.46629 2.38453L7.46868 2.38692Z"
                fill="#000"
              ></path>
              <path
                d="M5.95483 12.205C5.95483 11.2577 5.95483 10.3104 5.95483 9.36312C5.95483 8.88589 6.09204 8.47666 6.63727 8.44206C7.26006 8.4015 7.46169 8.83936 7.46527 9.36431C7.4772 11.2589 7.47839 13.1535 7.46527 15.0469C7.46169 15.5707 7.25648 16.0121 6.63727 15.9704C6.0992 15.9346 5.95483 15.5253 5.95603 15.0457C5.95961 14.0984 5.95603 13.1511 5.95603 12.2038L5.95483 12.205Z"
                fill="#000"
              ></path>
            </svg>
          </a>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M4 4 L16 16 M16 4 L4 16"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* List of links - spaced like screenshot with dividers */}
        <div className="px-6 py-6 flex-1 overflow-auto">
          <ul className="divide-y divide-gray-200/70">
            {navLinks.map((link, idx) => (
              <li key={link.href} className="py-6">
                <a
                  href={link.href}
                  ref={idx === 0 ? firstLinkRef : null}
                  className="block text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links that sit at bottom left like the screenshot */}
        <div className="px-6 pb-10">
          <div className="text-sm text-gray-600 space-y-3">
            <a href="/privacy" className="block">
              Privacy & Cookies
            </a>
            <a href="/terms" className="block">
              Terms of Use
            </a>
            <div className="pt-6 text-xs text-gray-400">1X © 2025</div>
          </div>
        </div>
      </div>
    </header>
  );
}
