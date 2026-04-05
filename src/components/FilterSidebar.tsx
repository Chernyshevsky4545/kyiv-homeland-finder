import React from 'react';
import { type ListingFilters } from '@/types/listing';
import { Search, SlidersHorizontal, Map, Building, Home, FilterX, TrainFront } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

interface SidebarProps {
  filters: ListingFilters;
  setFilters: React.Dispatch<React.SetStateAction<ListingFilters>>;
  totalResults?: number;
}

const DISTRICTS = [
  "Шевченківський", "Печерський", "Подільський", "Оболонський",
  "Дарницький", "Деснянський", "Святошинський", "Голосіївський",
  "Солом'янський", "Дніпровський",
];

export function FilterSidebar({ filters, setFilters, totalResults }: SidebarProps) {
  const handleTypeChange = (type: 'apartment' | 'house' | undefined) => {
    setFilters((prev) => ({ ...prev, type: prev.type === type ? undefined : type }));
  };

  const resetFilters = () => setFilters({});

  return (
    <div className="w-[340px] bg-card h-full border-r border-border shadow-2xl flex flex-col z-[500] relative shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Map className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground tracking-tight">KyivRealty</h1>
            <p className="text-xs font-medium text-muted-foreground">Карта нерухомості Києва</p>
          </div>
        </div>
      </div>

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-foreground">
            <SlidersHorizontal className="w-4 h-4 text-primary" /> Фільтри
          </h2>
          {Object.keys(filters).length > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs text-accent">
              <FilterX className="w-3 h-3 mr-1" /> Скинути
            </Button>
          )}
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Тип нерухомості</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTypeChange('apartment')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                filters.type === 'apartment'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted'
              }`}
            >
              <Building className="w-4 h-4" /> Квартира
            </button>
            <button
              onClick={() => handleTypeChange('house')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                filters.type === 'house'
                  ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-accent/40 hover:bg-muted'
              }`}
            >
              <Home className="w-4 h-4" /> Будинок
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ціна (USD)</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                placeholder="Від"
                className="w-full pl-7 pr-3 py-2.5 bg-background border-2 border-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
            <div className="w-2 h-[2px] bg-border rounded-full shrink-0"></div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                placeholder="До"
                className="w-full pl-7 pr-3 py-2.5 bg-background border-2 border-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Кількість кімнат</label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setFilters((prev) => ({ ...prev, rooms: prev.rooms === num ? undefined : num }))}
                className={`w-10 h-10 rounded-xl border-2 font-bold transition-all duration-200 flex items-center justify-center ${
                  filters.rooms === num
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted'
                }`}
              >
                {num}{num === 5 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Near Metro */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Поруч з метро</label>
          <div className="flex items-center justify-between bg-muted/50 border border-border/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <TrainFront className="w-4 h-4 text-primary" />
              До 1 км від метро
            </div>
            <Switch
              checked={!!filters.nearMetro}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, nearMetro: checked || undefined }))
              }
            />
          </div>
        </div>

        {/* District */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Район Києва</label>
          <div className="relative">
            <select
              className="w-full appearance-none px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
              value={filters.district || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, district: e.target.value || undefined }))}
            >
              <option value="">Усі райони</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-6 border-t border-border bg-muted/30 backdrop-blur-sm">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Знайдено об'єктів</p>
            <p className="text-2xl font-bold font-display text-primary">
              {totalResults !== undefined ? totalResults : '-'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
