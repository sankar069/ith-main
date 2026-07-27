import React, { useEffect, useState, useRef } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import CountUp from '../components/CountUp';
import { Check } from 'lucide-react';

function PhaseCard({ phase, delay }) {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <ScrollReveal delay={delay}>
      <div
        ref={cardRef}
        className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-7 md:p-9 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c84c30] flex items-center justify-center text-white text-xs font-bold shadow-md">
              {phase.num}
            </div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-cozy-dark dark:text-cozy-light">
              {phase.title}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl md:text-3xl font-serif italic font-bold text-[#c84c30]">
              {inView ? <CountUp end={phase.progress} suffix="%" duration={1800} /> : "0%"}
            </span>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">PROGRESS</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-5">
          <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-white ${phase.statusColor}`}>
            {phase.status}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-7 overflow-hidden">
          <div
            className="h-full rounded-full transition-all ease-out"
            style={{
              width: inView ? `${phase.progress}%` : '0%',
              backgroundColor: phase.barColor,
              transitionDuration: '2s',
              transitionDelay: '0.3s'
            }}
          />
        </div>

        {/* Bullet Points - 2 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
          {[...phase.col1, ...phase.col2].map((item, j) => (
            <div key={j} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 text-[#c84c30] shrink-0 mt-0.5 stroke-[2.5]" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function RoadmapSection() {
  const roadmapStats = [
    { metric: "80-85%", title: "Platform Readiness", desc: "Core features across all products", isNumeric: false },
    { metric: "4/4", title: "SaaS Products", desc: "All products in development", isNumeric: false },
    { metric: "By End 2026", title: "Pilot Ready", desc: "Ready for customer pilots", isNumeric: false },
    { metric: "5000", title: "Active Users", desc: "Student and organization users", suffix: "+", isNumeric: true }
  ];

  return (
    <ScrollReveal className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> ROADMAP
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center leading-tight">
        Upcoming Product <span className="text-[#c84c30] italic font-serif">Roadmap</span>
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-12 max-w-2xl leading-relaxed">
        Our journey from event platform to complete innovation ecosystem. Target: 80-85% readiness across core products by end of 2026.
      </p>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl mb-24">
        {roadmapStats.map((stat, i) => (
          <ScrollReveal key={i} className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center" delay={i * 150}>
            <h3 className="text-3xl md:text-4xl font-serif italic font-bold text-[#c84c30] mb-4 tracking-tight drop-shadow-sm">
              {stat.isNumeric ? (
                <CountUp end={Number(stat.metric)} suffix={stat.suffix || ""} duration={1500} />
              ) : (
                stat.metric
              )}
            </h3>
            <h4 className="text-sm md:text-base font-bold text-cozy-dark dark:text-cozy-light mb-1.5 font-serif">
              {stat.title}
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-sans">
              {stat.desc}
            </p>
          </ScrollReveal>
        ))}
      </div>

      {/* Development Phases Section */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0e6e3] dark:border-gray-800 bg-white/50 dark:bg-black/20 text-[10px] font-bold text-[#c84c30] uppercase mb-6 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> DEVELOPMENT PHASES
      </div>

      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-6 text-center leading-tight">
        Development <span className="text-[#c84c30] italic font-serif">Phases</span>
      </h2>

      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-12 max-w-2xl leading-relaxed">
        Six phases building towards a complete innovation ecosystem
      </p>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            num: "P1", title: "Event Ecosystem", status: "IN PROGRESS", statusColor: "bg-[#c84c30]",
            progress: 85, barColor: "#c84c30",
            col1: ["Event discovery platform", "Certificate generation", "AI recommendation engine"],
            col2: ["Registration and payment system", "Student dashboard", "Live expert sessions"]
          },
          {
            num: "P2", title: "Internal Operations", status: "IN PROGRESS", statusColor: "bg-[#c84c30]",
            progress: 70, barColor: "#c84c30",
            col1: ["Team task manager MVP", "Internal workflow automation", "Analytics dashboard"],
            col2: ["Volunteer tracking system", "Communication tools", "Member management"]
          },
          {
            num: "P3", title: "Event Operations SaaS", status: "PLANNING", statusColor: "bg-[#d4894e]",
            progress: 40, barColor: "#d4894e",
            col1: ["Public SaaS launch - Task Manager", "Pricing tiers and subscriptions", "Support system"],
            col2: ["Public SaaS launch - Volunteer Tracking", "Customer onboarding", "Marketing and sales"]
          },
          {
            num: "P4", title: "College Documentation", status: "PLANNING", statusColor: "bg-[#d4894e]",
            progress: 30, barColor: "#d4894e",
            col1: ["Repository system architecture", "Role-based access control", "Compliance tracking"],
            col2: ["NBA/NAAC integration", "Document audit system", "Pilot with 3 colleges"]
          },
          {
            num: "P5", title: "Smart Campus Workflow", status: "RESEARCH", statusColor: "bg-[#1e40af]",
            progress: 15, barColor: "#1e40af",
            col1: ["Faculty attendance system", "Smart alert engine", "Timetable sync"],
            col2: ["Biometric integration", "HOD escalation workflow", "Universal connector development"]
          },
          {
            num: "P6", title: "Full Ecosystem", status: "VISION", statusColor: "bg-[#6b21a8]",
            progress: 5, barColor: "#6b21a8",
            col1: ["Complete platform integration", "Enterprise plans", "White-label solutions"],
            col2: ["Cross-product analytics", "API marketplace", "Pan-India expansion"]
          }
        ].map((phase, i) => (
          <PhaseCard key={i} phase={phase} delay={i * 120} />
        ))}
      </div>
    </ScrollReveal>
  );
}
