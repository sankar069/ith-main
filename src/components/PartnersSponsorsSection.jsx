import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoLoop from './LogoLoop';
import { Handshake } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function PartnersSponsorsSection() {
  const navigate = useNavigate();
  const { setContactIntent } = useAppStore();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sponsors')
      .then((r) => r.json())
      .then((data) => {
        setPartners(
          (data.sponsors || [])
            .filter((s) => s.logo_url)
            .map((s) => ({ src: s.logo_url, alt: s.name }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goToContact = (intent) => {
    setContactIntent(intent);
    navigate('/contact');
  };

  return (
    <div className="w-full bg-cozy-light dark:bg-cozy-dark py-16 md:py-24">
      <div className="w-full max-w-full mx-auto flex flex-col items-center justify-center px-4">
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
        {!loading && partners.length === 0 ? (
          <p className="text-sm text-cozy-dark/50 dark:text-cozy-light/50 font-mono mb-4">
            Partners added in Admin → Content &amp; CMS → Partners &amp; Sponsors will appear here.
          </p>
        ) : (
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
        )}

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => goToContact('Partnership')}
            className="flex items-center gap-2 px-6 py-3 bg-cozy-primary text-white font-bold rounded-md shadow-flat hover:shadow-flat-hover hover:-translate-y-1 transition-all"
          >
            <Handshake className="w-5 h-5" />
            Become a Partner
          </button>
          <button
            onClick={() => goToContact('Sponsorship')}
            className="flex items-center gap-2 px-6 py-3 border-2 border-cozy-dark/20 dark:border-cozy-light/20 text-cozy-dark dark:text-cozy-light font-bold rounded-md hover:bg-cozy-dark/5 dark:hover:bg-cozy-light/5 transition-colors"
          >
            Sponsor an Event
          </button>
        </div>
      </div>
    </div>
  );
}
