import apartmentModern from '@/assets/listings/apartment-modern.jpg';
import apartmentFamily from '@/assets/listings/apartment-family.jpg';
import apartmentCompact from '@/assets/listings/apartment-compact.jpg';
import apartmentRenovation from '@/assets/listings/apartment-renovation.jpg';
import houseModern from '@/assets/listings/house-modern.jpg';
import houseClassic from '@/assets/listings/house-classic.jpg';
import houseGarden from '@/assets/listings/house-garden.jpg';
import houseRenovation from '@/assets/listings/house-renovation.jpg';
import type { Listing, ListingCondition } from '@/types/listing';

const apartmentImages: Record<ListingCondition, string[]> = {
  new_build: [apartmentModern, apartmentFamily],
  good: [apartmentFamily, apartmentModern, apartmentCompact],
  renovation_needed: [apartmentRenovation, apartmentCompact],
};

const houseImages: Record<ListingCondition, string[]> = {
  new_build: [houseModern, houseGarden],
  good: [houseGarden, houseClassic, houseModern],
  renovation_needed: [houseRenovation, houseClassic],
};

export function getListingImage(listing: Listing): string {
  if (listing.imageUrl) return listing.imageUrl;

  const pool = listing.type === 'house'
    ? houseImages[listing.condition]
    : apartmentImages[listing.condition];

  return pool[listing.id % pool.length];
}
