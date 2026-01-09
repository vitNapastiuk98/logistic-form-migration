import { FormArray, FormControl, FormGroup } from '@angular/forms';

// =================================================================
// 1. DOMAIN TYPES
// =================================================================

export type TransportMode = 'sea' | 'air';
export type HazardClass = 'explosive' | 'gas' | 'flammable' | '';

export interface CustomsData {
  clearanceCode: string;
}

export interface MetaData {
  transportMode: TransportMode;
  customs: CustomsData;
}

export interface CargoItem {
  description: string;
  isHazardous: boolean;
  hazardClass: HazardClass;
  weight: number;
}

export interface ManifestPayload {
  meta: MetaData;
  cargoItems: CargoItem[];
}

// =================================================================
// 2. FORM TYPES
// =================================================================

/**
 * Type for the 'customs' nested group
 */
export interface CustomsForm {
  clearanceCode: FormControl<string | null>;
}

/**
 * Type for the 'meta' group
 */
export interface MetaForm {
  transportMode: FormControl<TransportMode | null>;
  customs: FormGroup<CustomsForm>;
}

/**
 * Type for a single item inside the FormArray
 */
export interface CargoItemForm {
  description: FormControl<string | null>;
  isHazardous: FormControl<boolean | null>;
  hazardClass: FormControl<HazardClass | null>;
  weight: FormControl<number | null>;
}

/**
 * THE MASTER FORM STRUCTURE
 * usage: FormGroup<ManifestForm>
 */
export interface ManifestForm {
  meta: FormGroup<MetaForm>;
  cargoItems: FormArray<FormGroup<CargoItemForm>>;
}
