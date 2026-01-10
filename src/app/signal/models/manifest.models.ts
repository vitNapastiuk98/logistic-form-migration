
export type TransportMode = 'sea' | 'air';
export type HazardClass = 'explosive' | 'gas' | 'flammable' | '';

export interface Weight {
  unit: 'kg' | 'lbs';
  val: number;
}

export interface CustomsData {
  clearanceCode: string;
}

export interface MetaData {
  transportMode: TransportMode | null;
  customs: CustomsData | null;
}

export interface CargoItem {
  description: string;
  isHazardous: boolean;
  hazardClass: HazardClass | null;
  weight: number;
}

export interface ManifestPayload {
  meta: MetaData | null ;
  cargoItems: CargoItem[] | null;
}
