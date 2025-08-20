import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Link } from "expo-router";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { API_BASE_URL_API } from "@/constants/Api";

import Header from "@/components/Header";

const chat = require("@/assets/images/chat.png");

const MODELS_PER_PAGE = 12;

type Model = {
  id: number;
  name: string;
};

export default function ModelsScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { brandId, brandName }: { brandId: string; brandName: string } =
    useLocalSearchParams();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_API}/models/${brandId}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setModels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Impossible de charger les modèles.");
      } finally {
        setLoading(false);
      }
    };

    if (brandId) fetchModels();
  }, [brandId]);

  if (!brandId) {
    return (
      <View style={styles.container}>
        <Text>Brand not found</Text>
      </View>
    );
  }

  const totalPages = Math.ceil(models.length / MODELS_PER_PAGE);
  const paginatedModels = models.slice(
    (currentPage - 1) * MODELS_PER_PAGE,
    currentPage * MODELS_PER_PAGE
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header showBack={true} showHome={true} />

        <View style={styles.instructionContainer}>
          <Image source={chat} style={styles.chat} resizeMode="contain" />

          <Text style={styles.instructionText}>
            Indiquez le modèle de votre véhicule
          </Text>
        </View>

        {/* Models Grid - 3 per row */}
        {loading ? (
          <Text style={{ textAlign: "center", padding: 20 }}>
            Chargement...
          </Text>
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        ) : (
          <View style={styles.gridContainer}>
            {paginatedModels.map((model) => (
              <View key={model.name} style={styles.modelContainer}>
                <Link
                  href={{
                    pathname: "/Generations",
                    params: {
                      modelId: model.id,
                      modelName: model.name,
                      brandName,
                    },
                  }}
                  asChild
                >
                  <Pressable style={styles.modelItem}>
                    <Text style={styles.modelText}>{model.name}</Text>
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
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    padding: Spacing.lg,
    backgroundColor: Colors.lightBackground,
    textAlign: "center",
    color: Colors.primary,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  modelContainer: {
    width: "32%",
    marginBottom: Spacing.lg,
  },
  modelItem: {
    backgroundColor: Colors.lightGrey,
    padding: Spacing.lg,
    borderRadius: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
  },
  chat: {
    width: 100,
    height: 40,
  },
  modelText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
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
  disabledButton: {
    backgroundColor: Colors.disabledGreen,
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
    marginHorizontal: 15,
    minWidth: 60,
    textAlign: "center",
  },
  instructionContainer: {
    padding: Spacing.md,
    width: "100%",
    alignItems: "center",
  },
  instructionText: {
    color: Colors.red,
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
  },
});
