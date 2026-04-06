import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

function GalleryImage({ src, alt, onError }: { src: string; alt: string; onError: () => void }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setLoading(false);
    setFailed(true);
    onError();
  }, [onError]);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground gap-2">
        <ImageOff className="w-10 h-10" />
        <span className="text-xs">Зображення недоступне</span>
      </div>
    );
  }

  return (
    <>
      {loading && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={handleError}
      />
    </>
  );
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [failedSet, setFailedSet] = useState<Set<number>>(new Set());

  const validImages = images.filter((_, i) => !failedSet.has(i));

  const handleError = useCallback((index: number) => {
    setFailedSet((prev) => new Set(prev).add(index));
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  if (!images.length) {
    return (
      <div className="w-full h-64 bg-muted flex items-center justify-center text-muted-foreground">
        <ImageOff className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 bg-muted shrink-0 group">
      <GalleryImage
        src={images[current]}
        alt={`${alt} - ${current + 1}`}
        onError={() => handleError(current)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-primary-foreground scale-125' : 'bg-primary-foreground/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
