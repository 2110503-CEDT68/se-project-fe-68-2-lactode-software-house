'use client';

import { useMemo, useState } from 'react';

type ProgressiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

function getUnsplashPreviewSrc(src: string) {
  try {
    const url = new URL(src);
    if (url.hostname !== 'images.unsplash.com') {
      return null;
    }

    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('w', '48');
    url.searchParams.set('q', '20');
    url.searchParams.set('blur', '80');
    return url.toString();
  } catch {
    return null;
  }
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  priority = false,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const previewSrc = useMemo(() => getUnsplashPreviewSrc(src), [src]);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-slate-100 ${className}`.trim()}>
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
      ) : null}

      {previewSrc ? (
        <img
          src={previewSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full scale-105 object-cover blur-xl transition-opacity duration-300 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : null}

      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
