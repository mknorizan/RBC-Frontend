export interface PriceTier {
  type: "FIXED" | "ADULT" | "CHILD" | "INFANT";
  price: number;
  label: string;
}

export interface Service {
  id: number;
  name?: string;
  serviceName: string;
  description?: string;
}

export interface Package {
  id: string;
  title: string;
  name: string;
  categoryId: number;
  description?: string;
  priceTiers: PriceTier[];
  services: Service[];
  imageUrl: string;
  maxCapacity?: number;
  durationMinutes?: number;
  isPrivate?: boolean;
  distanceMinKm?: number;
  distanceMaxKm?: number;
  fishingType: "DEEP_SEA" | "SQUID" | null;
}
