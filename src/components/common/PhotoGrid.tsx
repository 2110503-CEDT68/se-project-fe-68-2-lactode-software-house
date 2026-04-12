export default function PhotoGrid({ images }: {images: string[]}) {
  const GRID_HEIGHT = "420px";

  // ── 0 images ──
  if (images.length === 0) {
    return (
      <div
        className="w-full bg-gray-100 rounded-2xl flex items-center justify-center"
        style={{ height: GRID_HEIGHT }}
      >
        <p className="text-gray-400 text-sm">No photos available</p>
      </div>
    );
  }

  // 1 image
  if (images.length === 1) {
    return (
      <div className="w-full rounded-2xl overflow-hidden" style={{ height: GRID_HEIGHT }}>
        <img
          src={images[0]}
          alt="Photo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 2 images
  if (images.length === 2) {
    return (
      <div
        className="w-full grid gap-2 rounded-2xl overflow-hidden"
        style={{ gridTemplateColumns: "1fr 1fr", height: GRID_HEIGHT }}
      >
        <Thumb src={images[0]} alt="Photo 1" />
        <Thumb src={images[1]} alt="Photo 2" />
      </div>
    );
  }

  // 3 images
  if (images.length === 3) {
    return (
      <div
        className="w-full grid gap-2 rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          height: GRID_HEIGHT,
        }}
      >
        <Thumb src={images[0]} alt="Photo 1" className="row-span-2" />
        <Thumb src={images[1]} alt="Photo 2" />
        <Thumb src={images[2]} alt="Photo 3" />
      </div>
    );
  }

  // 4 images
  if (images.length === 4) {
    return (
      <div
        className="w-full grid gap-2 rounded-2xl overflow-hidden"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          height: GRID_HEIGHT,
        }}
      >
        {/* Hero: left col, both rows */}
        <Thumb src={images[0]} alt="Photo 1" />
        {/* Top right: spans 2 cols, 1 row */}
        <Thumb src={images[1]} alt="Photo 2"/>
        {/* Bottom right: 2 individual cells */}
        <Thumb src={images[2]} alt="Photo 3" />
        <Thumb src={images[3]} alt="Photo 4" />
      </div>
    );
  }

  // 5+ images
  const hero = images[0];
  const thumbs = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <div
      className="w-full grid gap-2 rounded-2xl overflow-hidden"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        height: GRID_HEIGHT,
      }}
    >
      {/* Hero: left col, both rows */}
      <Thumb src={hero} alt="Photo 1" className="col-span-1 row-span-2" />

      {/* 4 thumbs in 2×2 on the right */}
      {thumbs.map((src, i) => {
        const isLast = i === 3;
        const showOverlay = isLast && remaining > 0;
        return (
          <Thumb key={i} src={src} alt={`Photo ${i + 2}`}>
            {showOverlay && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                <span className="text-white text-2xl font-semibold">
                  +{remaining} more
                </span>
              </div>
            )}
          </Thumb>
        );
      })}
    </div>
  );
}

// ── Thumb helper ─────────────────────────────────────────────────────────────

function Thumb({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />
      {children}
    </div>
  );
}