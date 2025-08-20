import { API_BASE_URL_API } from "@/constants/Api";
import { Product } from "@/types/products";

export async function getCompatibleProducts(
  fuelTypeId: number | string,
  category: string | null | undefined
): Promise<Product[]> {
  if (!fuelTypeId || !category) return [];

  const encodedCategory = encodeURIComponent(String(category));
  const url = `${API_BASE_URL_API}/products/${fuelTypeId}/${encodedCategory}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data = await res.json();

  // Map backend product shape to your frontend Product type if necessary
  return (Array.isArray(data) ? data : []).map((p: any) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image, // assume backend returns image filename
    price: typeof p.price === "number" ? p.price : Number(p.price || 0),
    specs: Array.isArray(p.specs) ? p.specs : [],
  })) as Product[];
}
