import React from 'react';
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
  return (
    <div className="mt-6 max-w-full overflow-hidden bg-white hidden lg:flex h-[120px]">
      <div className="flex items-center gap-x-12 infiniteSlider whitespace-nowrap">
        {[...Images, ...Images].map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Logo ${idx}`}
            draggable={false}
            className="inline-block h-[120px] w-auto"
          />
        ))}
      </div>
    </div>
  );
}
