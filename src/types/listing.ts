export type ListingType = 'apartment' | 'house';

export type ListingCondition = 'new_build' | 'good' | 'renovation_needed';

export interface Listing {
  id: number;
  type: ListingType;
  title: string;
  address: string;
  district: string;
  price: number;
  priceUah: number;
  rooms: number;
  area: number;
  floor?: number | null;
  totalFloors?: number | null;
  lat: number;
  lng: number;
  description: string;
  imageUrl?: string | null;
  source: string;
  registryId: string;
  yearBuilt?: number | null;
  condition: ListingCondition;
  listingDate: string;
  floorPlan?: string | null;
}

export interface ListingFilters {
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  district?: string;
  nearMetro?: boolean;
}
