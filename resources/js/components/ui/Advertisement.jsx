import React from 'react';

import Logoipsum from '@images/logoipsum.svg';
import Logoipsumbrand from '@images/logoipsum-brand.svg';
import LogoIpsum from '@images/ipsum.svg';
import Logoipsum1 from '@images/Logo-ipsum.svg';
import Logoipsum2 from '@images/startipsum.svg';

const Images = [
    Logoipsum,
    Logoipsumbrand,
    LogoIpsum,
    Logoipsum1,
    Logoipsum2,
];

export default function Advertisement() {
  return (
    <div className="max-w-full overflow-hidden bg-white hidden lg:flex h-[120px]">
      <div className="flex items-center gap-x-12 infiniteSlider whitespace-nowrap">
        {[...Images, ...Images].map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Logo ${idx}`}
            draggable={false}
            className="inline-block h-[40px] w-auto"
          />
        ))}
      </div>
    </div>
  );
}
