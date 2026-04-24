'use client';

import { useState, type ReactNode } from 'react';

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80';

type PhotoGridProps = {
  images: string[];
  fallbackImage?: string;
};

export default function PhotoGrid({ images, fallbackImage = DEFAULT_FALLBACK_IMAGE }: PhotoGridProps) {
  const GRID_HEIGHT = '420px';
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openPhoto = (index: number) => {
    if (!images[index]) return;
    setSelectedIndex(index);
  };

  const closePhoto = () => setSelectedIndex(null);

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return current === 0 ? images.length - 1 : current - 1;
    });
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return current === images.length - 1 ? 0 : current + 1;
    });
  };

  const modal = selectedIndex !== null ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6">
      <button
        type="button"
        onClick={closePhoto}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-semibold text-slate-900 shadow-md"
        aria-label="Close photo preview"
      >
        ×
      </button>

      {images.length > 1 ? (
        <button
          type="button"
          onClick={showPrevious}
          className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-semibold text-slate-900 shadow-md"
          aria-label="Previous photo"
        >
          ‹
        </button>
      ) : null}

      <div className="flex max-h-[86vh] w-full max-w-5xl flex-col items-center gap-4">
        <div className="max-h-[78vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
          <img
            src={images[selectedIndex]}
            alt={`Photo ${selectedIndex + 1}`}
            className="max-h-[78vh] w-full object-contain"
            onError={(event) => {
              const target = event.currentTarget;
              if (target.src === fallbackImage) return;
              target.src = fallbackImage;
            }}
          />
        </div>

        <p className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700">
          Photo {selectedIndex + 1} of {images.length}
        </p>
      </div>

      {images.length > 1 ? (
        <button
          type="button"
          onClick={showNext}
          className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-semibold text-slate-900 shadow-md"
          aria-label="Next photo"
        >
          ›
        </button>
      ) : null}
    </div>
  ) : null;

  if (images.length === 0) {
    return (
      <>
        <div
          className="flex w-full items-center justify-center rounded-2xl bg-gray-100"
          style={{ height: GRID_HEIGHT }}
        >
          <p className="text-sm text-gray-400">No photos available</p>
        </div>
        {modal}
      </>
    );
  }

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => openPhoto(0)}
          className="block w-full overflow-hidden rounded-2xl text-left"
          style={{ height: GRID_HEIGHT }}
        >
          <img
            src={images[0]}
            alt="Photo"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(event) => {
              const target = event.currentTarget;
              if (target.src === fallbackImage) return;
              target.src = fallbackImage;
            }}
          />
        </button>
        {modal}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <div
          className="grid w-full gap-2 overflow-hidden rounded-2xl"
          style={{ gridTemplateColumns: '1fr 1fr', height: GRID_HEIGHT }}
        >
          <Thumb src={images[0]} alt="Photo 1" fallbackImage={fallbackImage} onClick={() => openPhoto(0)} />
          <Thumb src={images[1]} alt="Photo 2" fallbackImage={fallbackImage} onClick={() => openPhoto(1)} />
        </div>
        {modal}
      </>
    );
  }

  if (images.length === 3) {
    return (
      <>
        <div
          className="grid w-full gap-2 overflow-hidden rounded-2xl"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            height: GRID_HEIGHT,
          }}
        >
          <Thumb
            src={images[0]}
            alt="Photo 1"
            className="row-span-2"
            fallbackImage={fallbackImage}
            onClick={() => openPhoto(0)}
          />
          <Thumb src={images[1]} alt="Photo 2" fallbackImage={fallbackImage} onClick={() => openPhoto(1)} />
          <Thumb src={images[2]} alt="Photo 3" fallbackImage={fallbackImage} onClick={() => openPhoto(2)} />
        </div>
        {modal}
      </>
    );
  }

  if (images.length === 4) {
    return (
      <>
        <div
          className="grid w-full gap-2 overflow-hidden rounded-2xl"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            height: GRID_HEIGHT,
          }}
        >
          <Thumb src={images[0]} alt="Photo 1" fallbackImage={fallbackImage} onClick={() => openPhoto(0)} />
          <Thumb src={images[1]} alt="Photo 2" fallbackImage={fallbackImage} onClick={() => openPhoto(1)} />
          <Thumb src={images[2]} alt="Photo 3" fallbackImage={fallbackImage} onClick={() => openPhoto(2)} />
          <Thumb src={images[3]} alt="Photo 4" fallbackImage={fallbackImage} onClick={() => openPhoto(3)} />
        </div>
        {modal}
      </>
    );
  }

  const hero = images[0];
  const thumbs = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <>
      <div
        className="grid w-full gap-2 overflow-hidden rounded-2xl"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          height: GRID_HEIGHT,
        }}
      >
        <Thumb
          src={hero}
          alt="Photo 1"
          className="col-span-1 row-span-2"
          fallbackImage={fallbackImage}
          onClick={() => openPhoto(0)}
        />

        {thumbs.map((src, i) => {
          const photoIndex = i + 1;
          const isLast = i === 3;
          const showOverlay = isLast && remaining > 0;

          return (
            <Thumb
              key={photoIndex}
              src={src}
              alt={`Photo ${photoIndex + 1}`}
              fallbackImage={fallbackImage}
              onClick={() => openPhoto(showOverlay ? 5 : photoIndex)}
            >
              {showOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-colors hover:bg-black/60">
                  <span className="text-2xl font-semibold text-white">+{remaining} more</span>
                </div>
              )}
            </Thumb>
          );
        })}
      </div>
      {modal}
    </>
  );
}

function Thumb({
  src,
  alt,
  className = '',
  fallbackImage,
  children,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackImage: string;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden bg-gray-100 text-left ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(event) => {
          const target = event.currentTarget;
          if (target.src === fallbackImage) return;
          target.src = fallbackImage;
        }}
      />
      {children}
    </button>
  );
}