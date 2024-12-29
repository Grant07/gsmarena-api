export interface PhoneSearchResult {
  name: string;
  brand: string;
  imageUrl: string;
  slug: string;
  releaseDate?: string;
}

export interface PhoneDetails {
  name: string;
  brand: string;
  imageUrl: string;
  releaseDate?: string;
  dimensions?: string;
  weight?: string;
  displaySize?: string;
  displayResolution?: string;
  chipset?: string;
  ram?: string[];
  storage?: string[];
  battery?: {
    capacity: string;
    type: string;
  };
  cameras: {
    main: CameraSpec[];
    selfie: CameraSpec[];
  };
  os?: string;
  specifications: Record<string, Record<string, string>>;
}

export interface CameraSpec {
  resolution: string;
  features?: string[];
}

export interface SearchOptions {
  limit?: number;
  page?: number;
}