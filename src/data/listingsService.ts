import { type Listing, type ListingFilters } from '@/types/listing';
import { listings as allListings } from '@/data/listings';
import { getNearestMetroDistance, NEAR_METRO_THRESHOLD } from '@/data/metroStations';

let deletedIdsCache: Set<number> = new Set();

export function setDeletedIds(ids: number[]) {
  deletedIdsCache = new Set(ids);
}

export function getListings(filters: ListingFilters): Listing[] {
  return allListings.filter((listing) => {
    if (deletedIdsCache.has(listing.id)) return false;
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.rooms && listing.rooms !== filters.rooms) return false;
    if (filters.district && listing.district !== filters.district) return false;
    if (filters.nearMetro) {
      const { distance } = getNearestMetroDistance(listing.lat, listing.lng);
      if (distance > NEAR_METRO_THRESHOLD) return false;
    }
    return true;
  });
}

export function getListingById(id: number): Listing | undefined {
  return allListings.find((l) => l.id === id);
}
