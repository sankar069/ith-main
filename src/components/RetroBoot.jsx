import React, { useState } from 'react';

const RetroBoot = ({ onBootComplete }) => {
  const [isBooting, setIsBooting] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  const handlePowerClick = () => {
    if (isBooting) return;
    setIsBooting(true);
    setAnimationStage(1);
    
    // Stage 1: White flash (CRT turn on)
    setTimeout(() => {
      setAnimationStage(2);
    }, 150);

    // Stage 2: CRT expand and fade to website
    setTimeout(() => {
      onBootComplete();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden w-full h-full">
      {/* 
        This wrapper uses min-w and min-h along with aspect-ratio to perfectly mimic 
        'object-fit: cover' behavior. It ensures the container always fills the screen, 
        but preserves the 2:1 aspect ratio so all percentage-based absolute positioning 
        remains perfectly aligned with the image pixels.
      */}
      <div 
        className="relative flex-shrink-0"
        style={{
          minWidth: '100vw',
          minHeight: '100vh',
          aspectRatio: '1920 / 960',
        }}
      >
        <img 
          src="/retro-tv.jpg" 
          alt="ITH Retro System" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />

        {/* Invisible clickable area for the green power button */}
        <div 
          onClick={handlePowerClick}
          className="absolute cursor-pointer rounded-md hover:bg-green-400/30 transition-colors shadow-[0_0_15px_rgba(0,255,0,0.1)]"
          style={{
            bottom: '10.5%',
            right: '29.3%',
            width: '1.8%',
            height: '3.6%',
            zIndex: 10
          }}
          title="Power On"
        />

        {/* Screen Area Overlay - perfectly matches the TV screen coordinates */}
        <div 
          className="absolute overflow-hidden rounded-[4%]"
          style={{
            top: '21%',
            left: '32%',
            width: '36%',
            height: '52%',
            zIndex: 5
          }}
        >
          {/* CRT Animation Overlays, constrained to the screen area */}
          {isBooting && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className={`bg-[#98fb98] mix-blend-screen shadow-[0_0_100px_rgba(152,251,152,1)] rounded-[5%] transition-all duration-700 ease-out ${
                  animationStage === 1 ? 'w-full h-[4px] opacity-100' : 
                  animationStage === 2 ? 'w-full h-full opacity-0 scale-150' : 'w-0 h-0 opacity-0'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetroBoot;
