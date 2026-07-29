import React, { useState } from 'react';
import { Play, ArrowRight, ExternalLink } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import ScrollRevealText from './ScrollRevealText';

export default function AboutSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full max-w-[85rem] mx-auto min-w-0 flex flex-col pt-24 pb-20 px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 w-full">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 flex flex-col items-start w-full">
          {/* Pill Badge */}
          <ScrollReveal delay={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-8 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> ABOUT INNOTECH HUB
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal delay={100}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 leading-[1.15]">
              Building the <span className="text-[#c84c30] italic font-serif">Future</span> of Student Innovation & Technology
            </h2>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={200} className="mb-10 w-full max-w-xl">
            <ScrollRevealText
              baseOpacity={0.05}
              enableBlur={true}
              baseRotation={2}
              blurStrength={5}
              textClassName="!text-sm md:!text-base !text-gray-600 dark:!text-gray-300 !leading-relaxed !font-sans !font-normal"
            >
              InnoTech Hub is an elite ecosystem bridging the gap between academia and industry. We empower students through high-impact hackathons, expert-led events, and practical learning experiences. Driven by our advanced AI Suite and modular SaaS solutions, we transform theoretical knowledge into measurable, real-world skills.
            </ScrollRevealText>
          </ScrollReveal>

          {/* CTA Button */}
          <ScrollReveal delay={300}>
            <button 
              onClick={() => document.getElementById('ai-suite')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-cozy-dark dark:bg-white text-white dark:text-cozy-dark font-sans text-sm font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1"
            >
              Explore Our Ecosystem
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </ScrollReveal>
        </div>

        {/* Right Side: YouTube Embed / Preview Card */}
        <div className="flex-1 w-full max-w-2xl relative">
          <ScrollReveal delay={200} className="w-full relative aspect-video rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(200,76,48,0.2)] dark:shadow-[0_20px_60px_-15px_rgba(200,76,48,0.1)] border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-xl group">
            
            {!isPlaying ? (
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-500 overflow-hidden"
                onClick={() => setIsPlaying(true)}
              >
                {/* Fallback thumbnail / placeholder - Replace src with actual thumbnail URL if available */}
                <img 
                  src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1200&auto=format&fit=crop" 
                  alt="Video Thumbnail" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Play Button Overlay */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/50 group-hover:scale-110 group-hover:bg-white/40 dark:group-hover:bg-white/10 transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1 fill-white" />
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-10 drop-shadow-md">
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-lg md:text-xl">What is InnoTech Hub?</span>
                    <span className="font-sans text-xs opacity-90">Watch Introduction • 45s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-black">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </ScrollReveal>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400/20 dark:bg-orange-600/20 blur-[60px] rounded-full -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 dark:bg-blue-600/20 blur-[60px] rounded-full -z-10"></div>
        </div>

      </div>
    </div>
  );
}
