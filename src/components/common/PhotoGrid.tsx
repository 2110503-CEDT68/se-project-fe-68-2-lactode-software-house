'use client';

import type { ReactNode } from 'react';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80';

type PhotoGridProps = {
  images: string[];
  fallbackImage?: string;
};

export default function PhotoGrid({ images, fallbackImage = DEFAULT_FALLBACK_IMAGE }: PhotoGridProps) {
  const GRID_HEIGHT = '420px';

  if (images.length === 0) {
    return (
      <div
        className="w-full rounded-2xl bg-gray-100 flex items-center justify-center"
        style={{ height: GRID_HEIGHT }}
      >
        <p className="text-gray-400 text-sm">No photos available</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full rounded-2xl overflow-hidden" style={{ height: GRID_HEIGHT }}>
        <img
          src={images[0]}
          alt="Photo"
          className="w-full h-full object-cover"
          onError={(event) => {
            const target = event.currentTarget;
            if (target.src === fallbackImage) return;
            target.src = fallbackImage;
          }}
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div
        className="w-full grid gap-2 rounded-2xl overflow-hidden"
        style={{ gridTemplateColumns: '1fr 1fr', height: GRID_HEIGHT }}
      >
        <Thumb src={images[0]} alt="Photo 1" fallbackImage={fallbackImage} />
        <Thumb src={images[1]} alt="Photo 2" fallbackImage={fallbackImage} />
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div
        className="w-full grid gap-2 rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          height: GRID_HEIGHT,
        }}
      >
        <Thumb src={images[0]} alt="Photo 1" className="row-span-2" fallbackImage={fallbackImage} />
        <Thumb src={images[1]} alt="Photo 2" fallbackImage={fallbackImage} />
        <Thumb src={images[2]} alt="Photo 3" fallbackImage={fallbackImage} />
      </div>
    );
  }

  if (images.length === 4) {
    return (
      <div
        className="w-full grid gap-2 rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          height: GRID_HEIGHT,
        }}
      >
        <Thumb src={images[0]} alt="Photo 1" fallbackImage={fallbackImage} />
        <Thumb src={images[1]} alt="Photo 2" fallbackImage={fallbackImage} />
        <Thumb src={images[2]} alt="Photo 3" fallbackImage={fallbackImage} />
        <Thumb src={images[3]} alt="Photo 4" fallbackImage={fallbackImage} />
      </div>
    );
  }

  const hero = images[0];
  const thumbs = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <div
      className="w-full grid gap-2 rounded-2xl overflow-hidden"
      style={{
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        height: GRID_HEIGHT,
      }}
    >
      <Thumb src={hero} alt="Photo 1" className="col-span-1 row-span-2" fallbackImage={fallbackImage} />

      {thumbs.map((src, i) => {
        const isLast = i === 3;
        const showOverlay = isLast && remaining > 0;
        return (
          <Thumb key={i} src={src} alt={`Photo ${i + 2}`} fallbackImage={fallbackImage}>
            {showOverlay && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                <span className="text-white text-2xl font-semibold">+{remaining} more</span>
              </div>
            )}
          </Thumb>
        );
      })}
    </div>
  );
}

function Thumb({
  src,
  alt,
  className = '',
  fallbackImage,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackImage: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        onError={(event) => {
          const target = event.currentTarget;
          if (target.src === fallbackImage) return;
          target.src = fallbackImage;
        }}
      />
      {children}
    </div>
  );
}
