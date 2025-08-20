import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { setVehicleConfig } from "@/store/vehicleSlice";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { API_BASE_URL_API } from "@/constants/Api";

import Header from "@/components/Header";

const chat = require("@/assets/images/chat.png");

type FuelType = {
  id: number;
  fuel: string; // API field name for the fuel label
  model?: string;
  brand?: string;
  generation?: string;
};

export default function FuelTypeScreen() {
  // Keep reading route params if you're navigating from previous screens
  const {
    generationId,
    brandName: paramBrand,
    modelName: paramModel,
    generationName: paramGeneration,
  }: any = useLocalSearchParams();

  const dispatch = useDispatch();
  const router = useRouter();

  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL_API}/fuel-types/${generationId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        // Ensure we store an array (defensive)
        setFuelTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des types de carburant:", err);
        setError("Impossible de charger les types de carburant.");
      } finally {
        setLoading(false);
      }
    };

    if (generationId) fetchFuelTypes();
  }, [generationId]);

  const handleFuelTypeSelect = (fuel: FuelType) => {
    // Prefer API-provided brand/model/generation if present, otherwise fall back to params
    const brand = fuel.brand ?? paramBrand ?? "";
    const model = fuel.model ?? paramModel ?? "";
    const generation = fuel.generation ?? paramGeneration ?? "";

    dispatch(
      setVehicleConfig({
        brand,
        model,
        generation,
        fuelType: fuel.fuel ?? "Inconnu",
        fuelTypeId: fuel.id,
      })
    );

    router.push({
      pathname: "/Products",
      params: {
        brand,
        model,
        generation,
        fuelTypeId: fuel.id,
        fuelTypeName: fuel.fuel,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header showBack showHome />

        <View style={styles.instructionContainer}>
          <Image source={chat} style={styles.chat} resizeMode="contain" />
          <Text style={styles.instructionText}>
            Choisissez le type de carburant
          </Text>
        </View>

        {loading ? (
          <Text style={{ textAlign: "center" }}>Chargement...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.gridContainer}>
            {fuelTypes.map((fuel) => (
              <Pressable
                key={fuel.id}
                style={styles.fuelItem}
                onPress={() => handleFuelTypeSelect(fuel)}
              >
                <Text style={styles.fuelText}>
                  {fuel.fuel ?? "Type inconnu"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContainer: { flexGrow: 1 },
  instructionContainer: {
    padding: Spacing.md,
    alignItems: "center",
  },
  instructionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    color: Colors.red,
    textAlign: "center",
  },
  chat: {
    width: 100,
    height: 40,
    marginBottom: Spacing.md,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  fuelItem: {
    width: "48%",
    backgroundColor: Colors.lightGrey,
    padding: Spacing.lg,
    borderRadius: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
  },
  fuelText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    color: Colors.black,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.red,
    textAlign: "center",
    marginTop: 50,
  },
});
