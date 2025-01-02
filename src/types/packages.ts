export interface FishingPackage {
  id: string;
  type: "fishing";
  title: string;
  image?: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  duration: string;
  capacity: number;
  distance: string;
  services: string[];
  techniques: string[];
}

export interface BoatPackage {
  id: string;
  type: "boat";
  title: string;
  description: string;
  privateBoatPrice?: number;
  adultPrice?: number;
  kidPrice?: number;
  duration: string;
  capacity: number;
  services: string[];
}
