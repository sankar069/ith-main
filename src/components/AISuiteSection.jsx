import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  FileText, 
  Compass 
} from 'lucide-react';

export default function AISuiteSection() {
  const [activeTool, setActiveTool] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const aiTools = [
    {
      id: 'chat-assistant',
      icon: Bot,
      title: "AI Chat Assistant",
      desc: "A personal mentor suggesting events, courses, projects, teammates, and career paths.",
      isComingSoon: false,
      features: ["Event Suggestions", "Course Recommendations", "Project Ideas", "Teammate Matching"],
      color: "#06b6d4"
    },
    {
      id: 'event-recommendation',
      icon: Compass,
      title: "AI Event Recommendation",
      desc: "Recommends events based on skills, interests, year, and career goals.",
      isComingSoon: true,
      features: ["Skill Matching", "Interest Filtering", "Career Alignment", "Year-based Curation"],
      color: "#3b82f6"
    },
    {
      id: 'idea-generator',
      icon: Lightbulb,
      title: "AI Idea Generator",
      desc: "Hackathon ideas tuned to theme, team skills, time, and tech stack.",
      isComingSoon: true,
      features: ["Theme Tuning", "Tech Stack Integration", "Time-frame Optimization", "Team Skill Alignment"],
      color: "#f59e0b"
    },
    {
      id: 'idea-analyzer',
      icon: ShieldCheck,
      title: "AI Idea Analyzer",
      desc: "Checks uniqueness, feasibility, business value, and presentation strength.",
      isComingSoon: true,
      features: ["Uniqueness Check", "Feasibility Audit", "Business Value Rating", "Presentation Feedback"],
      color: "#8b5cf6"
    },
    {
      id: 'team-matching',
      icon: Users,
      title: "AI Team Matching",
      desc: "Matches by skills, interests, availability, domain, and project goals.",
      isComingSoon: true,
      features: ["Domain Alignment", "Skill Complementarity", "Availability Match", "Goal Synchronization"],
      color: "#ec4899"
    },
    {
      id: 'resume-analyzer',
      icon: FileText,
      title: "Resume Analyzer",
      desc: "Resume score, missing skills, ATS suggestions, and event-based bullets.",
      isComingSoon: true,
      features: ["Resume Scoring", "Skill Gap Detection", "ATS Optimization", "Event-based Bullets"],
      color: "#ef4444"
    },
    {
      id: 'career-guidance',
      icon: Sparkles,
      title: "AI Career Guidance",
      desc: "Personalized career roadmaps, skill gap analysis, and next-step recommendations for your tech journey.",
      isComingSoon: true,
      features: ["Personalized Roadmaps", "Skill Gap Analysis", "Next-step Guidance", "Tech Journey Tracking"],
      color: "#10b981"
    }
  ];

  // Set default active tool if none is hovered
  useEffect(() => {
    if (!isHovering && !activeTool) {
      setActiveTool(aiTools[0]);
    }
  }, [isHovering, activeTool, aiTools]);

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] dark:bg-[#0a0a0a] flex flex-col items-center pt-24 pb-20 px-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#c84c30]/10 dark:bg-[#c84c30]/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000"></div>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-white/10 bg-white/80 dark:bg-white/5 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-4 font-mono z-10 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> THE FUTURE IS HERE
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-cozy-dark dark:text-white mb-3 text-center z-10">
        AI-Powered <span className="text-[#c84c30] italic font-serif">Student Growth Tools</span>
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center font-sans mb-16 max-w-xl z-10">
        AI guides students before, during, and after every event.
      </p>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Side: Orbital Animation Container */}
        <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square flex items-center justify-center">
          
          {/* Center Glowing Circle */}
          <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#c84c30] to-[#eebf3f] flex items-center justify-center shadow-[0_0_40px_rgba(200,76,48,0.4)] dark:shadow-[0_0_60px_rgba(200,76,48,0.3)] z-20">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-white mx-auto mb-1" />
              <div className="font-serif font-bold text-white text-sm md:text-base leading-tight">InnoTech<br/>AI Suite</div>
            </div>
          </div>

          {/* Orbit Rings */}
          <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-full z-0"></div>
          <div className="absolute inset-8 border border-black/5 dark:border-white/5 rounded-full z-0"></div>

          {/* Orbiting Nodes Container */}
          <motion.div 
            className="absolute inset-0 z-10"
            animate={{ rotate: isHovering ? 0 : 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {aiTools.map((tool, index) => {
              const angle = (index / aiTools.length) * 2 * Math.PI;
              const radius = 42; // Percentage radius
              const left = `calc(50% + ${Math.cos(angle) * radius}%)`;
              const top = `calc(50% + ${Math.sin(angle) * radius}%)`;
              const Icon = tool.icon;
              
              const isActive = activeTool?.id === tool.id;

              return (
                <div
                  key={tool.id}
                  className="absolute -ml-6 -mt-6 md:-ml-7 md:-mt-7"
                  style={{ left, top }}
                >
                  {/* Counter-rotation to keep icons upright */}
                  <motion.div 
                    animate={{ rotate: isHovering ? 0 : -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <button
                      onMouseEnter={() => {
                        setActiveTool(tool);
                        setIsHovering(true);
                      }}
                      onMouseLeave={() => setIsHovering(false)}
                      className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/80 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg transition-all duration-300 ${isActive ? 'scale-125 z-30 shadow-[0_0_30px_rgba(200,76,48,0.3)] border-[#c84c30]' : 'hover:scale-110 z-10'}`}
                    >
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${isActive ? 'text-[#c84c30]' : 'text-gray-600 dark:text-gray-300'}`} />
                      
                      {/* Active glow dot */}
                      {isActive && (
                        <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#c84c30] shadow-[0_0_10px_#c84c30]"></div>
                      )}
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Side: Dynamic Content Panel */}
        <div className="w-full max-w-md h-[450px] lg:h-[500px] relative">
          <AnimatePresence mode="wait">
            {activeTool && (
              <motion.div
                key={activeTool.id}
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
              >
                {/* Header with Icon and Coming Soon Tag */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#c84c30]/10 dark:bg-[#c84c30]/20 flex items-center justify-center border border-[#c84c30]/20">
                      <activeTool.icon className="w-6 h-6 text-[#c84c30]" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-cozy-dark dark:text-white leading-snug">
                      {activeTool.title}
                    </h3>
                  </div>

                  {activeTool.isComingSoon ? (
                    <span className="shrink-0 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold font-mono tracking-wider uppercase">
                      COMING SOON
                    </span>
                  ) : (
                    <span className="shrink-0 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono tracking-wider uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-8">
                  {activeTool.desc}
                </p>

                {/* Features List */}
                <div className="flex flex-col gap-3 mb-auto">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 font-mono">
                    Key Capabilities
                  </h4>
                  {activeTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#c84c30]/10 dark:bg-[#c84c30]/20 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#c84c30]"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 font-sans">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="mt-8 w-full group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cozy-dark dark:bg-white text-white dark:text-cozy-dark font-sans text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  {activeTool.isComingSoon ? "Join Waitlist" : "Explore Tool"}
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
