import { useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { getListingById } from '@/data/listingsService';
import { formatPrice, formatPriceUah } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Heart, Building2, Home, MapPin, Maximize, Layers,
  Calendar, Hammer, ChevronRight, X, ExternalLink, Hash, ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Listing } from '@/types/listing';
import { getListingImage, getListingImages } from '@/lib/listingMedia';
import { ImageGallery } from '@/components/ImageGallery';

const CONDITION_LABELS: Record<string, string> = {
  new_build: 'Новобудова',
  good: 'Хороший стан',
  renovation_needed: 'Потребує ремонту',
};

function PropertyDetail({ listing, onClose, onRemove }: { listing: Listing; onClose: () => void; onRemove: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 bg-muted">
          <img
            src={getListingImage(listing)}
            alt={listing.title}
            className="w-full h-full object-cover"
            loading="eager"
            width={1280}
            height={960}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <Badge
            variant={listing.type === 'apartment' ? 'default' : 'secondary'}
            className="absolute bottom-3 left-3"
          >
            {listing.type === 'apartment' ? (
              <><Building2 className="w-3 h-3 mr-1" /> Квартира</>
            ) : (
              <><Home className="w-3 h-3 mr-1" /> Будинок</>
            )}
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl font-bold font-display text-foreground">{listing.title}</h2>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>{listing.address}, {listing.district}</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <span className="text-3xl font-bold font-display text-primary">{formatPrice(listing.price)}</span>
            <span className="text-muted-foreground ml-2 text-sm">({formatPriceUah(listing.priceUah)})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <Maximize className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="font-bold text-foreground">{listing.area} м²</p>
              <p className="text-xs text-muted-foreground">Площа</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <Layers className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="font-bold text-foreground">{listing.rooms}</p>
              <p className="text-xs text-muted-foreground">Кімнати</p>
            </div>
            {listing.floor != null && (
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <ArrowUpDown className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="font-bold text-foreground">{listing.floor}{listing.totalFloors ? `/${listing.totalFloors}` : ''}</p>
                <p className="text-xs text-muted-foreground">Поверх</p>
              </div>
            )}
            {listing.yearBuilt != null && (
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="font-bold text-foreground">{listing.yearBuilt}</p>
                <p className="text-xs text-muted-foreground">Рік</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Hammer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Стан:</span>
            <Badge variant="outline">{CONDITION_LABELS[listing.condition] ?? listing.condition}</Badge>
          </div>

          <div>
            <h3 className="font-bold font-display text-foreground mb-2">Опис</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{listing.description}</p>
          </div>

          {listing.sourceUrl && (
            <a
              href={listing.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline bg-primary/5 border border-primary/10 rounded-xl px-3 py-2 w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Перейти до джерела
            </a>
          )}

          <div className="border-t border-border/50 pt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Джерело: {listing.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5" />
              <span>Реєстр: {listing.registryId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Дата: {new Date(listing.listingDate).toLocaleDateString('uk-UA')}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="destructive" size="sm" className="gap-2" onClick={onRemove}>
              <Heart className="w-4 h-4" /> Видалити з обраного
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onClose}>
              Закрити
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Favorites() {
  const { favoriteIds, isLoading, toggleFavorite } = useFavorites();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const favorites = favoriteIds
    .map((id) => getListingById(id))
    .filter(Boolean) as Listing[];

  const selectedListing = selectedId != null ? favorites.find((l) => l.id === selectedId) ?? null : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">Обране</h1>
          <Badge variant="secondary" className="ml-auto">{favorites.length} об'єктів</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Завантаження...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/30" />
            <h2 className="text-xl font-display font-bold text-foreground">Поки що пусто</h2>
            <p className="text-muted-foreground">Додавайте об'єкти до обраного натиснувши ❤️ на карті</p>
            <Button onClick={() => navigate('/')}>На карту</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((listing) => (
              <div
                key={listing.id}
                className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => setSelectedId(listing.id)}
              >
                <div className="relative h-40 bg-muted">
                  <img
                    src={getListingImage(listing)}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1280}
                    height={960}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-destructive/10 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-destructive text-destructive" />
                  </button>
                  <Badge
                    variant={listing.type === 'apartment' ? 'default' : 'secondary'}
                    className="absolute bottom-3 left-3"
                  >
                    {listing.type === 'apartment' ? (
                      <><Building2 className="w-3 h-3 mr-1" /> Квартира</>
                    ) : (
                      <><Home className="w-3 h-3 mr-1" /> Будинок</>
                    )}
                  </Badge>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold font-display text-foreground leading-tight line-clamp-1">{listing.title}</h3>
                    <span className="font-bold text-primary font-display shrink-0 ml-2">{formatPrice(listing.price)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{listing.district}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {listing.area} м²</span>
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {listing.rooms} кім.</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedListing && (
        <PropertyDetail
          listing={selectedListing}
          onClose={() => setSelectedId(null)}
          onRemove={() => { toggleFavorite(selectedListing.id); setSelectedId(null); }}
        />
      )}
    </div>
  );
}
