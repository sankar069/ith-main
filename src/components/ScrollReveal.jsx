import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial state
    gsap.set(el, {
      opacity: 0,
      y: 60,
      scale: 0.97,
    });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: delay / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=80',
          end: 'top center',
          toggleActions: 'play none none none',
        }
      });
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
