import React from 'react';
import { X, Building2, Home, MapPin, Maximize, Layers, Calendar, ClipboardCheck, Info, Link as LinkIcon, Heart } from 'lucide-react';
import { formatPrice, formatPriceUah } from '@/lib/format';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { type Listing } from '@/types/listing';
import { getListingById } from '@/data/listingsService';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PropertyPanelProps {
  listingId: number | null;
  onClose: () => void;
}

const CONDITION_LABELS: Record<string, string> = {
  new_build: 'Новобудова',
  good: 'Хороший стан',
  renovation_needed: 'Потребує ремонту',
};

export function PropertyPanel({ listingId, onClose }: PropertyPanelProps) {
  const listing = listingId ? getListingById(listingId) : undefined;
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleFavorite = () => {
    if (!user) {
      toast.info('Увійдіть щоб зберігати обрані об\'єкти');
      navigate('/auth');
      return;
    }
    if (listingId) toggleFavorite(listingId);
  };

  return (
    <>
      {listingId && listing && (
        <div
          className="fixed top-4 bottom-4 right-4 w-[400px] max-w-[calc(100vw-32px)] bg-card rounded-3xl shadow-2xl border border-border/50 z-[1000] overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
        >
          {/* Close & Favorite */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-card/80 backdrop-blur-md hover:bg-card border border-border/50 shadow-sm"
              onClick={handleFavorite}
            >
              <Heart
                className={`w-5 h-5 ${user && isFavorite(listingId) ? 'fill-destructive text-destructive' : 'text-foreground'}`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-card/80 backdrop-blur-md hover:bg-card border border-border/50 shadow-sm"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-foreground" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* Image Header */}
            <div className="w-full h-64 relative bg-muted shrink-0">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <Badge variant={listing.type === 'apartment' ? 'default' : 'secondary'} className="shadow-md">
                  {listing.type === 'apartment' ? (
                    <><Building2 className="w-3 h-3 mr-1" /> Квартира</>
                  ) : (
                    <><Home className="w-3 h-3 mr-1" /> Будинок</>
                  )}
                </Badge>
                <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold font-display text-primary shadow-lg border border-card/50">
                  {formatPrice(listing.price)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-foreground font-display leading-tight mb-2">{listing.title}</h2>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span className="text-sm">{listing.address}, {listing.district}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{formatPriceUah(listing.priceUah)}</p>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 border border-border/50 rounded-2xl p-4 flex flex-col">
                  <Maximize className="w-5 h-5 text-muted-foreground mb-2" />
                  <span className="text-2xl font-bold text-foreground font-display">{listing.area}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Кв. метрів</span>
                </div>
                <div className="bg-muted/50 border border-border/50 rounded-2xl p-4 flex flex-col">
                  <Layers className="w-5 h-5 text-muted-foreground mb-2" />
                  <span className="text-2xl font-bold text-foreground font-display">{listing.rooms}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Кімнати</span>
                </div>
              </div>

              {/* Details */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-border/50">
                  {listing.type === 'apartment' && listing.floor && (
                    <div className="flex justify-between items-center p-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Поверх
                      </span>
                      <span className="text-sm font-semibold">{listing.floor} з {listing.totalFloors}</span>
                    </div>
                  )}
                  {listing.yearBuilt && (
                    <div className="flex justify-between items-center p-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Рік побудови
                      </span>
                      <span className="text-sm font-semibold">{listing.yearBuilt}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" /> Стан
                    </span>
                    <Badge variant="outline">{CONDITION_LABELS[listing.condition] || listing.condition}</Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3 uppercase tracking-wider">
                  <Info className="w-4 h-4 text-primary" /> Опис
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>

              {/* Source */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-auto">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LinkIcon className="w-3 h-3" /> Джерело даних
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{listing.source}</span>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">#{listing.registryId}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Оновлено: {new Date(listing.listingDate).toLocaleDateString('uk-UA')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
