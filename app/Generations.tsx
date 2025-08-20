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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { API_BASE_URL_API } from "@/constants/Api";

import Header from "@/components/Header";

const chat = require("@/assets/images/chat.png");

type Generation = {
  id: number;
  name: string;
};

export default function GenerationsScreen() {
  const { modelId, modelName, brandName }: any = useLocalSearchParams();
  const router = useRouter();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL_API}/generations/${modelId}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setGenerations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des générations:", err);
        setError("Erreur lors du chargement des générations.");
      } finally {
        setLoading(false);
      }
    };

    if (modelId) fetchGenerations();
  }, [modelId]);

  const handleSelect = (generation: Generation) => {
    router.push({
      pathname: "/FuelType",
      params: {
        generationId: generation.id,
        brandName,
        modelName,
        generationName: generation.name,
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
            Sélectionnez la génération de votre véhicule
          </Text>
        </View>

        {loading ? (
          <Text style={{ textAlign: "center" }}>Chargement...</Text>
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        ) : (
          <View style={styles.gridContainer}>
            {generations.map((generation) => (
              <Pressable
                key={generation.id}
                onPress={() => handleSelect(generation)}
                style={styles.generationItem}
              >
                <Text style={styles.generationText}>{generation.name}</Text>
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
    width: "100%",
    alignItems: "center",
  },
  chat: { width: 100, height: 40 },
  instructionText: {
    color: Colors.red,
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  generationItem: {
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
  generationText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
  },
});
