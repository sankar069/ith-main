import React, { useState } from 'react';
import { Send } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add logic here to handle form submission
  };

  return (
    <div className="w-full max-w-[75rem] mx-auto min-w-0 flex flex-col items-center pt-20 pb-20 px-4 relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-500/5 dark:bg-orange-900/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <ScrollReveal className="w-full flex flex-col items-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cozy-dark/10 dark:border-cozy-light/10 bg-white/80 dark:bg-black/50 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#c84c30] shadow-sm mb-6 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c84c30]"></span> GET IN TOUCH
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-4 text-center leading-tight">
          Let's Build the <span className="text-[#c84c30] italic font-serif">Future</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center font-sans mb-12 max-w-2xl">
          Whether you want to partner with us, sponsor an event, or bring InnoTech Hub to your campus, we'd love to connect.
        </p>

        {/* Contact Form Container (Premium Glass) */}
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-10 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-sans">
                Full Name
              </label>
              <input 
                type="text" 
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe" 
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm font-sans placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c84c30]/20 focus:border-[#c84c30] transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-sans">
                Email Address
              </label>
              <input 
                type="email" 
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com" 
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm font-sans placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c84c30]/20 focus:border-[#c84c30] transition-all"
              />
            </div>

            {/* Phone Number (Optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-sans">
                Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000" 
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm font-sans placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c84c30]/20 focus:border-[#c84c30] transition-all"
              />
            </div>

            {/* Company / Organization (Optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-sans">
                Organization <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input 
                type="text" 
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp / University" 
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm font-sans placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c84c30]/20 focus:border-[#c84c30] transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="mt-6 w-full md:w-auto self-center flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cozy-dark dark:bg-white text-white dark:text-cozy-dark font-sans text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            Let's Connect
          </button>
        </form>
      </ScrollReveal>
    </div>
  );
}
