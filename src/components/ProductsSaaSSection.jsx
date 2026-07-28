import React from 'react'
import { ClipboardList, MapPin, FolderOpen, BellRing, Check } from 'lucide-react'
import ScrollRevealText from '../components/ScrollRevealText'

export default function ProductsSaaSSection() {
  const products = [
    {
      icon: ClipboardList,
      title: "Club / Team Task Manager",
      desc: "Replace messy WhatsApp coordination with structured task tracking, proof-based completion, and team dashboards.",
      bullets: [
        "Super admin workspace",
        "Member accounts",
        "Team & club creation",
        "Tasks, deadlines, priorities",
        "Proof upload",
        "Pending/completed/overdue dashboards"
      ],
      note: "Ongoing product in active internal use by InnoTech-Hub teams."
    },
    {
      icon: MapPin,
      title: "Volunteer Attendance & Tracking",
      desc: "Smart volunteer attendance and location verification for large college events and club programs.",
      bullets: [
        "Client admin & event setup",
        "GPS check-in/out",
        "Geo-tagged photo proof",
        "Live tracking option",
        "Team lead verification",
        "Volunteer reports"
      ],
      note: "Upcoming product for event duty tracking, used only with consent."
    },
    {
      icon: FolderOpen,
      title: "College Repository System",
      desc: "Inspection-ready document repository for NBA, NAAC, IQAC, JNTU, departments, faculty, and clubs.",
      bullets: [
        "Department & faculty folders",
        "Role-based access",
        "Approval workflow",
        "Audit logs & versioning",
        "Missing document tracker",
        "Inspection-ready reports"
      ],
      note: "Upcoming SaaS to solve the chaos of Drive, WhatsApp, pendrives, and faculty laptops."
    },
    {
      icon: BellRing,
      title: "Faculty Attendance & Smart Alerts",
      desc: "Smart academic workflow — timetables, biometric data, alerts, and reports unified into one system.",
      bullets: [
        "Class alert system",
        "Biometric notification",
        "Universal biometric connector (eSSL, ZKTeco, Hikvision, Matrix...)",
        "BioSync local agent",
        "HOD escalation",
        "Department reports"
      ],
      note: "Positioned as academic workflow & visibility — not surveillance."
    }
  ]

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-10 px-4">
      
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> ONGOING & UPCOMING SAAS
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center max-w-3xl leading-tight">
        Beyond Events: <span className="text-[#c84c30] italic font-serif">Ongoing and Upcoming Products</span>
      </h2>

      {/* Subtitle */}
      <div className="max-w-3xl text-center mb-12">
        <ScrollRevealText
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={5}
          textClassName="!text-sm md:!text-base !text-gray-500 dark:!text-gray-400 !font-sans !leading-relaxed !font-normal"
        >
          Modular SaaS for clubs, teams, colleges, and smart campus operations. The official event platform stays internal — these products power our clients.
        </ScrollRevealText>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {products.map((product, i) => {
          const Icon = product.icon
          return (
            <div 
              key={i} 
              className="bg-[#FCFDFD] dark:bg-black/40 border border-[#f0e6e3] dark:border-gray-800 rounded-3xl p-8 md:p-10 flex flex-col items-start shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group"
            >
              {/* Icon Box */}
              <div className="w-10 h-10 rounded-[10px] bg-[#c84c30] flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Text */}
              <h3 className="text-xl md:text-2xl font-serif font-bold text-cozy-dark dark:text-cozy-light mb-3">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mb-8 leading-relaxed">
                {product.desc}
              </p>

              {/* Bullets */}
              <div className="flex flex-col gap-3 mb-10 w-full">
                {product.bullets.map((bullet, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#c84c30] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-snug">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

              {/* Note Footer */}
              <div className="mt-auto border-l-2 border-[#e6d9d5] dark:border-gray-700 pl-4 py-1">
                <p className="text-[11.5px] md:text-[13px] text-gray-400 dark:text-gray-500 italic font-sans leading-tight">
                  {product.note}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
