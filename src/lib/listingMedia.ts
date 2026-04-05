import type { Listing, ListingCondition } from '@/types/listing';

// Unsplash photo pools for generating multiple images per listing
const apartmentPhotoIds: Record<ListingCondition, string[]> = {
  new_build: [
    'photo-1560448204-e02f11c3d0e2',
    'photo-1502672260266-1c1ef2d93688',
    'photo-1560185127-6ed189bf02f4',
    'photo-1600585154340-be6161a56a0c',
    'photo-1600607687939-ce8a6c25118c',
    'photo-1600566753086-00f18fb6b3ea',
  ],
  good: [
    'photo-1522708323590-d24dbb6b0267',
    'photo-1600585154526-990dced4db0d',
    'photo-1600573472550-8090b5e0745e',
    'photo-1600607687644-c7171b42498f',
    'photo-1560448075-bb5de742e3e4',
    'photo-1600566753190-17f0baa2a6c3',
  ],
  renovation_needed: [
    'photo-1600585154340-be6161a56a0c',
    'photo-1560185127-6ed189bf02f4',
    'photo-1600573472592-401b489a3cdc',
    'photo-1560448204-603e6b4c3e38',
  ],
};

const housePhotoIds: Record<ListingCondition, string[]> = {
  new_build: [
    'photo-1600596542815-ffad4c1539a9',
    'photo-1600585154340-be6161a56a0c',
    'photo-1600607687939-ce8a6c25118c',
    'photo-1600047509807-ba8f99d2cdde',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600585154526-990dced4db0d',
  ],
  good: [
    'photo-1600047509358-9dc75507daeb',
    'photo-1600596542815-ffad4c1539a9',
    'photo-1600585154340-be6161a56a0c',
    'photo-1600566753190-17f0baa2a6c3',
    'photo-1600607687644-c7171b42498f',
  ],
  renovation_needed: [
    'photo-1600047509807-ba8f99d2cdde',
    'photo-1600573472592-401b489a3cdc',
    'photo-1560448204-603e6b4c3e38',
    'photo-1560185127-6ed189bf02f4',
  ],
};

function unsplashUrl(photoId: string, w = 800): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&q=80`;
}

/** Get the primary (thumbnail) image */
export function getListingImage(listing: Listing): string {
  if (listing.imageUrl) return listing.imageUrl;
  const pool = listing.type === 'house'
    ? housePhotoIds[listing.condition]
    : apartmentPhotoIds[listing.condition];
  return unsplashUrl(pool[listing.id % pool.length]);
}

/** Get all images for a listing gallery (3-6 images) */
export function getListingImages(listing: Listing): string[] {
  const pool = listing.type === 'house'
    ? housePhotoIds[listing.condition]
    : apartmentPhotoIds[listing.condition];

  // Pick 4-6 unique images from pool, seeded by listing id
  const count = Math.min(pool.length, 3 + (listing.id % 4)); // 3-6 images
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(unsplashUrl(pool[(listing.id + i) % pool.length]));
  }

  // If listing has a custom imageUrl, prepend it
  if (listing.imageUrl) {
    images.unshift(listing.imageUrl);
  }

  return images;
}

/** Sample floor plan images (blueprint style) */
const floorPlanImages = [
  'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&q=80',
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
  'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
];

/** Get floor plan for a listing (deterministic based on id) */
export function getFloorPlan(listing: Listing): string | null {
  if (listing.floorPlan) return listing.floorPlan;
  // ~60% of listings have a floor plan
  if (listing.id % 5 < 3) {
    return floorPlanImages[listing.id % floorPlanImages.length];
  }
  return null;
}
