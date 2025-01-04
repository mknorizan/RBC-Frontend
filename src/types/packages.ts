export interface PackageOption {
  id: number;
  name: string;
  title?: string;
  type: string;
  priceMin: number;
  priceMax: number;
  distance?: string;
  techniques: string[];
  services: string[];
}

export interface RecreationPackage extends PackageOption {
  type: "recreation";
}

export interface FishingPackage extends PackageOption {
  type: "fishing";
}
