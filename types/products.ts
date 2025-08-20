export type Product = {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  specs: string[];
  category: string;
};

export type ProductCompatibility = {
  id: number;
  fuelType: string;
  product: Product;
};

export type VehicleSearchParams = {
  brand: string;
  model: string;
  generation: string;
  fuelTypeId: string;
  fuelTypeName: string;
};

export type ProductType =
  | "balais"
  | "eclairage"
  | "batteries"
  | "huiles-moteur"
  | "filtres"
  | "lave-glaces"
  | "liquide-refroidissement";