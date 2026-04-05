import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  if (!images.length) return null;

  return (
    <div className="relative w-full h-64 bg-muted shrink-0 group">
      <img
        src={images[current]}
        alt={`${alt} - ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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

          {/* Dots */}
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
