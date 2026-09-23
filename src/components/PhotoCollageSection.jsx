import React from 'react';

const PHOTOS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    alt: 'Students collaborating',
    rotation: '-rotate-6',
    zIndex: 'z-10',
    offsetY: 'translate-y-4'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    alt: 'Presentation',
    rotation: 'rotate-3',
    zIndex: 'z-20',
    offsetY: '-translate-y-6'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    alt: 'Group working',
    rotation: '-rotate-2',
    zIndex: 'z-10',
    offsetY: 'translate-y-2'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    alt: 'Friends together',
    rotation: 'rotate-6',
    zIndex: 'z-30',
    offsetY: '-translate-y-2'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    alt: 'Event gathering',
    rotation: '-rotate-3',
    zIndex: 'z-20',
    offsetY: 'translate-y-8'
  },
];

export default function PhotoCollageSection() {
  // We render the list of photos twice in two separate animated containers 
  // so the marquee loops seamlessly without any gaps.
  return (
    <div className="relative w-full z-20 pb-16 pt-8 md:pt-12 pointer-events-none flex">
      {/* Container 1 */}
      <div className="flex w-max animate-marquee hover:animation-play-state-paused pointer-events-auto items-center pr-4 md:pr-12">
        {PHOTOS.map((photo, index) => (
          <div 
            key={`set1-${photo.id}`}
            className={`
              group relative transition-all duration-500 ease-out cursor-pointer
              w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 flex-shrink-0
              hover:-translate-y-6 hover:scale-105 hover:z-50
              -ml-3 sm:-ml-6 md:-ml-8
              ${photo.rotation} ${photo.offsetY}
              ${index % 5 === 0 ? 'z-10' : index % 5 === 1 ? 'z-20' : index % 5 === 2 ? 'z-30' : index % 5 === 3 ? 'z-20' : 'z-10'}
            `}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border-4 md:border-[6px] border-white shadow-xl group-hover:shadow-2xl transition-shadow duration-500 bg-white">
              <img 
                src={photo.url} 
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Container 2 (Duplicate for loop) */}
      <div className="flex w-max animate-marquee hover:animation-play-state-paused pointer-events-auto items-center pr-4 md:pr-12" aria-hidden="true">
        {PHOTOS.map((photo, index) => (
          <div 
            key={`set2-${photo.id}`}
            className={`
              group relative transition-all duration-500 ease-out cursor-pointer
              w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 flex-shrink-0
              hover:-translate-y-6 hover:scale-105 hover:z-50
              -ml-3 sm:-ml-6 md:-ml-8
              ${photo.rotation} ${photo.offsetY}
              ${index % 5 === 0 ? 'z-10' : index % 5 === 1 ? 'z-20' : index % 5 === 2 ? 'z-30' : index % 5 === 3 ? 'z-20' : 'z-10'}
            `}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border-4 md:border-[6px] border-white shadow-xl group-hover:shadow-2xl transition-shadow duration-500 bg-white">
              <img 
                src={photo.url} 
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
