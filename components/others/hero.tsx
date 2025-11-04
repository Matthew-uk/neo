// HeroSection.jsx
// Single-file React component styled with Tailwind CSS.
// - Full-bleed hero image (cover)
// - Centered content block with headline, subhead, CTA and small deposit text
// - Accessible: semantic markup, aria, keyboard-focusable CTA
// - Responsive with careful scale for very small -> very large screens
// - Gentle gradient overlay for legibility and subtle parallax-ready structure

import ResponsiveNavbar from './navbar';

export default function HeroSection({
  imageSrc = '/img/logo.avif', // replace with your image path or pass in as prop
  alt = 'Person embracing a home robot',
  headline = 'NEO',
  subheadline = 'Home Robot',
  ctaText = 'Order Now',
  depositText = '$200 Deposit',
}) {
  return (
    <section
      className="relative w-full h-screen min-h-[640px] select-none"
      aria-label="Hero"
    >
      <ResponsiveNavbar />
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* subtle dark gradient to aid contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/8 to-transparent pointer-events-none"
          aria-hidden
        />
      </div>

      {/* Decorative left & right faint vignette for cinematic feel */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,0,0,0.15)_0%,_transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,0,0,0.12)_0%,_transparent_40%)]" />
      </div>

      {/* Content wrapper — centers horizontally and vertically, with careful spacing */}
      <div className="relative z-10 flex items-end justify-center h-full">
        <div className="max-w-[720px] w-full px-6 sm:px-10 text-center mb-24">
          {/* Headline */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="mt-3 text-white/90 text-sm sm:text-base md:text-lg font-medium tracking-wide">
            {subheadline}
          </p>

          {/* CTA cluster */}
          <div className="mt-0 sm:mt-2 flex flex-col items-center gap-3">
            <a
              href="/order"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-gray-900 text-sm font-medium shadow-[0_8px_24px_rgba(16,24,40,0.25)] hover:shadow-[0_12px_30px_rgba(16,24,40,0.30)] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
              role="button"
              aria-label={`Order ${headline}`}
            >
              {ctaText}
            </a>

            <span className="text-white text-xs sm:text-[0.95rem] ">
              {depositText}
            </span>
          </div>

          {/* Small decorative caption for extra realism (hidden on tiny screens) */}
          {/* <div className="mt-8 text-white/60 text-xs sm:text-sm hidden sm:block">
            <p>
              Carefully designed to blend into modern living spaces — soft
              fabric face, intuitive interaction, and a calming presence.
            </p>
          </div> */}
        </div>
      </div>

      {/* Accessibility: reduce motion preference respected via CSS classes — if user has that preference
          they won't see transform/animation effects. */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .reduce-motion\:transform {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
