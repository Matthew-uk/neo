// pages/index.tsx
import Head from 'next/head';
import VideoCarousel from '@/components/others/VideoCarousel';

const slides = [
  {
    id: 1,
    src: '/video/transform2.mov', // replace with your video path or remote URL
    poster: '/video/poster1.jpg',
    alt: 'Tidy Living Room',
    title: 'Expert Mode',
    subtitle:
      'NEO works autonomously by default. For any chore it doesn’t know, you can schedule a 1X Expert to guide it, helping NEO learn while getting the job done.',
  },
  {
    id: 2,
    src: '/video/transform.mov',
    poster: '/video/poster2.jpg',
    alt: 'Kitchen Clean',
    title: 'Expert Mode',
    subtitle:
      'NEO works autonomously by default. For any chore it doesn’t know, you can schedule a 1X Expert to guide it, helping NEO learn while getting the job done.',
  },
  {
    id: 3,
    src: '/video/transform2.mov',
    poster: '/video/poster3.jpg',
    alt: 'Bedroom Makeover',
    title: 'Expert Mode',
    subtitle:
      'NEO works autonomously by default. For any chore it doesn’t know, you can schedule a 1X Expert to guide it, helping NEO learn while getting the job done.',
  },
];

export default function Automate() {
  return (
    <>
      <Head>
        <title>Automate Your Chores</title>
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero top */}
        <section className="max-w-4xl mx-auto text-center pt-10 pb-8">
          <div className="text-xs text-orange-600 font-semibold tracking-wider uppercase">
            Utility
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-gray-800">
            Automate Your Chores
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Give your NEO a list of chores, schedule a time you want them done
            and come back to a cleaner home everyday.
          </p>
        </section>

        {/* Video carousel overlaps the hero slightly */}
        <section className="max-w-7xl mx-auto px-4 -mt-12">
          <div className="rounded-xl overflow-hidden">
            <VideoCarousel
              slides={slides}
              autoplay
              autoplayMs={7000}
              height="62vh"
            />
          </div>
        </section>

        {/* additional content placeholder */}
        <section className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-500">Other page content...</p>
        </section>
      </main>
    </>
  );
}
