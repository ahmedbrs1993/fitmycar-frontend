export const productDisplayNames: Record<string, string> = {
  balais: "Balais essuie glace",
  eclairage: "Éclairage",
  batteries: "Batteries",
  "huiles-moteur": "Huiles moteur",
  filtres: "Filtres et accessoires",
  "lave-glaces": "Lave-glaces",
  "liquide-refroidissement": "Liquide de refroidissement",
};

export const images: Record<string, any> = {
  "Huiles moteur": require("@/assets/images/huile-diag.jpg"),
  "Filtres et accessoires": require("@/assets/images/filtres-accessoires.jpg"),
};

export const subOptions: Record<string, string[]> = {
  "Huiles moteur": ["Vidange", "Appoint"],
  "Filtres et accessoires": ["Joints et bouchons", "Filtres à huile"],
};

export const TABLET_MIN_WIDTH = 870;
export const SMALL_SCREEN_WIDTH = 450;
