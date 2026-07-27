import React from 'react';
import LogoLoop from './LogoLoop';
import { Handshake } from 'lucide-react';

const partners = [
  { src: "/stpeters.png", alt: "St. Peter's Engineering College" },
  { src: "/hackerrank.png", alt: "HackerRank" },
  { src: "/gemini.png", alt: "Google Gemini" },
  { src: "/geeksforgeeks.png", alt: "Geeks for Geeks" },
  { src: "/hack2skills.png", alt: "Hack2Skills" },
];

export default function PartnersSponsorsSection() {
  return (
    <div className="w-full max-w-full mx-auto flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-primary/30 bg-cozy-primary/10 text-xs font-semibold tracking-wider text-cozy-primary">
        <span className="w-2 h-2 rounded-full bg-cozy-primary"></span>
        COLLABORATORS
      </div>

      <h2 className="text-3xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center">
        Partners & <span className="text-cozy-primary italic font-serif">Sponsors</span>
      </h2>

      <p className="text-cozy-dark/70 dark:text-cozy-light/70 font-mono text-sm max-w-2xl text-center mb-16">
        Our collaborators help us create better learning experiences and innovation-driven events.
      </p>

      {/* Expanded the container width to 100% and increased height/logoHeight */}
      <div className="w-full" style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
        <LogoLoop
          logos={partners}
          speed={40}
          direction="left"
          logoHeight={140}
          gap={120}
          hoverSpeed={10}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="var(--logoloop-fadeColorAuto)"
          ariaLabel="Partner logos"
        />
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <button className="flex items-center gap-2 px-6 py-3 bg-cozy-primary text-white font-bold rounded-md shadow-flat hover:shadow-flat-hover hover:-translate-y-1 transition-all">
          <Handshake className="w-5 h-5" />
          Become a Partner
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-cozy-dark/20 dark:border-cozy-light/20 text-cozy-dark dark:text-cozy-light font-bold rounded-md hover:bg-cozy-dark/5 dark:hover:bg-cozy-light/5 transition-colors">
          Sponsor an Event
        </button>
      </div>
    </div>
  );
}
