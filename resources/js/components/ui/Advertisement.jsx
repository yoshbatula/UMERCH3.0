import React, { useRef, useEffect } from 'react';
import CHSE from '@images/CHSE.svg';
import CTE from '@images/CTE-LOGO.svg';
import CHE from '@images/CHE.svg';
import CEE from '@images/CEE.svg';
import CCJE from '@images/CCJE.svg';
import CCE from '@images/CCE.svg';
import CBAE from '@images/CBAE.svg';
import CASE from '@images/CASE.svg';
import CAFAE from '@images/CAFAE.svg';
import CAE from '@images/CAE.svg';

const Images = [
    CHSE,
    CTE,
    CHE,
    CEE,
    CCJE,
    CCE,
    CBAE,
    CASE,
    CAFAE,
    CAE
];

export default function Advertisement() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animId;
    let offset = 0;
    const speed = 0.6; // px per frame

    const animate = () => {
      offset += speed;
      // Reset when we've scrolled exactly half the track width (one full set)
      const half = track.scrollWidth / 2;
      if (offset >= half) offset = 0;
      track.style.transform = `translateX(-${offset}px)`;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const renderSet = (prefix) =>
    Images.map((img, idx) => (
      <img
        key={`${prefix}-${idx}`}
        src={img}
        alt={`Logo ${idx}`}
        draggable={false}
        loading="eager"
        className="h-[120px] w-auto mx-6 shrink-0"
      />
    ));

  return (
    <div className="mt-6 w-full overflow-hidden bg-white hidden lg:block h-[120px]">
      <div ref={trackRef} className="flex items-center h-full">
        {renderSet('a')}
        {renderSet('b')}
      </div>
    </div>
  );
}
