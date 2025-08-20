import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { API_BASE_URL_API } from "@/constants/Api";

import Header from "@/components/Header";

const chat = require("@/assets/images/chat.png");
const BRANDS_PER_PAGE = 12;
const TABLET_MIN_WIDTH = 750;

type Brand = {
  id: number;
  name: string;
};

export default function BrandsScreen() {
  const { width } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_API}/brands`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const isTablet = width >= TABLET_MIN_WIDTH;
  const totalPages = Math.ceil(brands.length / BRANDS_PER_PAGE);

  const paginatedBrands = brands.slice(
    (currentPage - 1) * BRANDS_PER_PAGE,
    currentPage * BRANDS_PER_PAGE
  );

  const [immatriculation, setImmatriculation] = useState("");
  const [error, setError] = useState("");

  const handleChange = (text: string) => {
    const rawText = text.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (rawText.length <= 7) {
      setImmatriculation(rawText);

      const regex = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
      if (rawText.length === 7 && !regex.test(rawText)) {
        setError("Format invalide. Exemple: AB123CD");
      } else {
        setError("");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header showBack={true} showHome={true} />

        <View style={styles.searchContainer}>
          <Text style={styles.searchTitle}>Voiture et camionnette</Text>
          <Text style={styles.searchSubtitle}>Par immatriculation</Text>
          <Text style={styles.searchDescription}>
            Plus précis et plus rapide pour la sélection de produits et de
            services.
          </Text>

          <TextInput
            style={[styles.searchInput, { width: isTablet ? "25%" : "50%" }]}
            placeholder="AB-123-CD"
            placeholderTextColor={Colors.darkGrey}
            value={immatriculation}
            onChangeText={handleChange}
            autoCapitalize="characters"
            maxLength={7}
          />
          {!!error && (
            <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
          )}

          <Pressable style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Rechercher</Text>
          </Pressable>
        </View>

        <View style={styles.instructionContainer}>
          <Image source={chat} style={styles.chat} resizeMode="contain" />
          <Text style={styles.instructionText}>
            Ou bien Indiquez la marque de votre véhicule
          </Text>
        </View>

        {/* Brands Grid - 3 per row */}
        {loading ? (
          <Text style={{ textAlign: "center", padding: 20 }}>
            Chargement...
          </Text>
        ) : (
          <View style={styles.gridContainer}>
            {paginatedBrands.map((brand) => (
              <View key={brand.id} style={styles.brandContainer}>
                <Link
                  href={{
                    pathname: "/Models",
                    params: {
                      brandId: brand.id,
                      brandName: brand.name,
                    },
                  }}
                  asChild
                >
                  <Pressable style={styles.brandItem}>
                    <Text style={styles.brandText}>{brand.name}</Text>
                  </Pressable>
                </Link>
              </View>
            ))}
          </View>
        )}

        {/* Pagination Controls */}
        <View style={styles.paginationContainer}>
          <Pressable
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton,
            ]}
            onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <Text style={styles.paginationText}>Previous</Text>
          </Pressable>

          <Text style={styles.pageIndicator}>
            {currentPage} / {totalPages}
          </Text>

          <Pressable
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
            onPress={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            <Text style={styles.paginationText}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  chat: {
    width: 100,
    height: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  brandContainer: {
    width: "32%",
    marginBottom: Spacing.lg,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  brandItem: {
    backgroundColor: Colors.lightGrey,
    padding: Spacing.xl,
    borderRadius: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
  },
  brandText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: Colors.disabledGreen,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    marginTop: "auto",
    backgroundColor: Colors.lightBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.lightBorder,
  },
  paginationButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 30,
    marginHorizontal: Spacing.lg,
    alignItems: "center",
  },
  paginationText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
  },
  pageIndicator: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "600",
    color: Colors.primary,
    minWidth: 70,
    textAlign: "center",
  },
  instructionContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    width: "100%",
    alignItems: "center",
  },
  instructionText: {
    color: Colors.red,
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.lightBackground,
    alignItems: "center",
  },
  searchTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 4,
    textAlign: "center",
  },
  searchSubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "600",
    color: Colors.red,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  searchDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.darkGrey,
    marginBottom: Spacing.md,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: Colors.white,
    borderColor: Colors.lightBorder,
    borderWidth: 1,
    borderRadius: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
  },
});
