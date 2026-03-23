import { type Listing, type ListingFilters } from '@/types/listing';
import { listings as allListings } from '@/data/listings';

export function getListings(filters: ListingFilters): Listing[] {
  return allListings.filter((listing) => {
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.rooms && listing.rooms !== filters.rooms) return false;
    if (filters.district && listing.district !== filters.district) return false;
    return true;
  });
}

export function getListingById(id: number): Listing | undefined {
  return allListings.find((l) => l.id === id);
}
