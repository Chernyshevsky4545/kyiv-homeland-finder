import React, { useState, useMemo } from 'react';
import { PropertyMap } from '@/components/PropertyMap';
import { FilterSidebar } from '@/components/FilterSidebar';
import { PropertyPanel } from '@/components/PropertyPanel';
import { AppHeader } from '@/components/AppHeader';
import { type ListingFilters } from '@/types/listing';
import { getListings } from '@/data/listingsService';

const Index = () => {
  const [filters, setFilters] = useState<ListingFilters>({});
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

  const listings = useMemo(() => getListings(filters), [filters]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <FilterSidebar filters={filters} setFilters={setFilters} totalResults={listings.length} />

      <main className="flex-1 relative">
        <AppHeader />
        <PropertyMap
          listings={listings}
          onMarkerClick={(id) => setSelectedListingId(id)}
          selectedId={selectedListingId}
        />
        <PropertyPanel listingId={selectedListingId} onClose={() => setSelectedListingId(null)} />
      </main>
    </div>
  );
};

export default Index;
