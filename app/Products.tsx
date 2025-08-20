import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/Api";
import { getCompatibleProducts } from "@/lib/api";
import { Typography } from "@/constants/Typography";

import { Product, VehicleSearchParams } from "@/types/products";

import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@/components/Header";

export default function ProductsScreen() {
  const params = useLocalSearchParams<VehicleSearchParams>();

  const vehicle = useSelector((state: RootState) => state.vehicle);
  const { product, subProduct } = useSelector(
    (state: RootState) => state.product
  );

  const brand = vehicle.brand || params.brand;
  const model = vehicle.model || params.model;
  const generation = vehicle.generation || params.generation;
  const fuelType = vehicle.fuelType || params.fuelTypeName;
  const fuelTypeId = vehicle.fuelTypeId || params.fuelTypeId;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (!fuelTypeId) {
          setProducts([]);
          return;
        }

        const category = product; // from Redux
        if (!category) {
          setProducts([]);
          return;
        }

        setLoading(true);
        const compatible = await getCompatibleProducts(fuelTypeId, category);
        setProducts(compatible);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack showHome />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Product Type and Vehicle Info */}
        <View style={styles.topRowContainer}>
          <View style={styles.productSection}>
            <View style={styles.iconTextRow}>
              <Ionicons name="checkmark" size={22} color="#4CAF50" />
              <Text style={styles.highlightedText}>
                {product
                  ? product.charAt(0).toUpperCase() + product.slice(1)
                  : ""}
                {subProduct
                  ? " - " +
                    subProduct.charAt(0).toUpperCase() +
                    subProduct.slice(1)
                  : ""}
              </Text>
            </View>
          </View>
          <View style={styles.brandModelSection}>
            <View style={styles.iconTextRow}>
              <Ionicons name="car" size={22} color="#4CAF50" />
              <Text style={styles.vehicleBrand}>
                {brand}{" "}
                <Text style={styles.vehicleModel}>
                  {model + " - "} {generation + " - "} {fuelType}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsTitleContainer}>
          <Text style={styles.resultsTitle}>Résultats de votre recherche</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        ) : (
          <View style={styles.productsContainer}>
            {products.length === 0 ? (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>
                  Aucun produit disponible pour ce véhicule.
                </Text>
              </View>
            ) : (
              products.map((item) => (
                <Pressable key={item.id} style={styles.productCard}>
                  <Image
                    source={{
                      uri: `${API_BASE_URL}/images/products/${item.image}`,
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productBrand}>{item.brand}</Text>
                    <Text style={styles.productPrice}>
                      {item.price.toFixed(2)} €
                    </Text>
                    {item.specs && Array.isArray(item.specs) && (
                      <View style={{ marginTop: 4 }}>
                        {item.specs.map((spec, index) => (
                          <Text key={index} style={styles.specText}>
                            {spec}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContainer: { flexGrow: 1 },
  resultsTitleContainer: { marginBottom: 16 },
  resultsTitle: {
    fontSize: Typography.fontSize.lg + 2,
    fontWeight: "bold",
    color: Colors.red,
    textAlign: "center",
    paddingBottom: 8,
  },
  topRowContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  productSection: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    marginLeft: 15,
    borderRadius: 10,
  },
  brandModelSection: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightedText: {
    color: Colors.primary,
    fontWeight: "bold",
    marginLeft: 6,
  },
  vehicleBrand: {
    fontWeight: "bold",
    color: Colors.black,
  },
  vehicleModel: {
    color: Colors.darkGrey,
    fontWeight: "bold",
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 10,
    justifyContent: "space-between",
    gap: 12,
  },
  productCard: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
  },
  productDetails: {
    alignItems: "center",
  },
  productName: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  productBrand: {
    fontSize: Typography.fontSize.sm,
    color: Colors.darkGrey,
    marginBottom: 2,
    textAlign: "center",
  },
  productPrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  specText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.darkGrey,
    lineHeight: 18,
    textAlign: "center",
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    width: "100%",
  },
  noProductsText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
  },
});
