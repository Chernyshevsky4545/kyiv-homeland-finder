import { useFavorites } from '@/hooks/useFavorites';
import { getListingById } from '@/data/listingsService';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Building2, Home, MapPin, Maximize, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const { favoriteIds, isLoading, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorites = favoriteIds
    .map((id) => getListingById(id))
    .filter(Boolean);

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
            {favorites.map((listing) => listing && (
              <div
                key={listing.id}
                className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative h-40 bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60"
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(listing.id)}
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
                  <div className="flex gap-3 text-sm text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {listing.area} м²</span>
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {listing.rooms} кім.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
