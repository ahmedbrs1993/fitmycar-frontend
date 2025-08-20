import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { bricks } from "@/data/bricks";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearVehicleConfig } from "@/store/vehicleSlice";
import { setProduct, clearProduct } from "@/store/productSlice";
import { useEffect } from "react";
import { TABLET_MIN_WIDTH, SMALL_SCREEN_WIDTH } from "@/constants/Contants";

import Header from "@/components/Header";

const slogan = require("@/assets/images/auchan-slogan.jpg");
const leftImage = require("@/assets/images/auchan-recharge.jpg");

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const router = useRouter();
  const product = useSelector((state: RootState) => state.product);
  const { brand, model, generation, fuelType } = useSelector(
    (state: RootState) => state.vehicle
  );

  const isTablet = width >= TABLET_MIN_WIDTH;
  const isSmallScreen = width < SMALL_SCREEN_WIDTH;
  const hasVehicleConfig = !!brand && !!model && !!generation && !!fuelType;

  useEffect(() => {
    if (product) {
      dispatch(clearProduct());
    }
  }, []);

  const handleBrickPress = (item: any) => {
    dispatch(setProduct(item.product));
    if (item.subProducts) {
      router.push("/SubProduct");
    } else if (hasVehicleConfig) {
      router.push("/Products");
    } else {
      router.push("/Brands");
    }
  };

  const renderBrick = (item: (typeof bricks)[0], index: number) => {
    const dynamicStyle = isTablet ? styles.brickTablet : styles.brickMobile;
    const backgroundStyle =
      item.id === 6
        ? styles.whiteBackground
        : item.id === 7 || item.id === 8
        ? styles.greyBackground
        : styles.primaryBackground;

    const textSize = isSmallScreen
      ? styles.brickTextSmall
      : styles.brickTextBase;

    return (
      <Pressable
        key={index}
        style={[styles.brickBase, dynamicStyle, backgroundStyle]}
        onPress={() => item.product && handleBrickPress(item)}
      >
        <Text style={[styles.brickText, textSize]}>{item.name}</Text>
        <Image source={item.icon} style={styles.brickIcon} />
      </Pressable>
    );
  };

  const renderSloganSection = () => {
    const sloganWidth = isSmallScreen ? width * 0.7 : width * 0.4;
    const sloganHeight = sloganWidth * (80 / 400);
    return (
      <View style={styles.sloganContainer}>
        <Image
          source={slogan}
          style={[
            styles.sloganImage,
            { width: sloganWidth, height: sloganHeight },
          ]}
        />
        <View style={styles.sloganRight}>
          {isTablet && (
            <Pressable
              onPress={() => {
                window.open("", "_blank");
              }}
            ></Pressable>
          )}
          {hasVehicleConfig && isTablet && (
            <Pressable
              onPress={() => dispatch(clearVehicleConfig())}
              style={styles.reinitializeButton}
            >
              <Text style={styles.reinitializeText}>
                Réinitialiser véhicule : {brand} {model} {generation} {fuelType}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const renderTabletLayout = () => (
    <View style={styles.content}>
      <View style={styles.imageContainer}>
        <Image source={leftImage} style={styles.image} />
      </View>
      <View style={styles.rightContainer}>{bricks.map(renderBrick)}</View>
    </View>
  );

  const renderMobileLayout = () => (
    <View style={styles.contentMobile}>
      <View style={styles.imageContainer}>
        <Image source={leftImage} style={styles.image} />
      </View>

      {hasVehicleConfig && (
        <Pressable
          onPress={() => dispatch(clearVehicleConfig())}
          style={[styles.reinitializeButton, { marginBottom: 10 }]}
        >
          <Text style={styles.reinitializeText}>
            Réinitialiser véhicule : {brand} {model} {generation} {fuelType}
          </Text>
        </Pressable>
      )}
      <View style={styles.rightContainer}>{bricks.map(renderBrick)}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header isHome={true} />
        {renderSloganSection()}
        {isTablet ? renderTabletLayout() : renderMobileLayout()}
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
  reinitializeButton: {
    backgroundColor: Colors.secondary,
    padding: Spacing.lg - 1,
    alignSelf: "center",
    borderRadius: 6,
    marginHorizontal: Spacing.lg - 1,
    maxWidth: 390,
  },
  reinitializeText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
  },
  sloganContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: Colors.white,
  },
  sloganImage: {
    resizeMode: "contain",
  },
  sloganRight: {
    alignItems: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    padding: Spacing.md - 2,
    flexDirection: "row",
    maxHeight: 600,
  },
  contentMobile: {
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.md,
    overflow: "hidden",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: Spacing.md,
    paddingTop: 10,
    gap: Spacing.sm,
  },
  brickBase: {
    borderRadius: Spacing.xs + 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
  },
  brickTablet: {
    width: "32%",
    aspectRatio: 1,
    minHeight: 150,
    maxHeight: 172,
  },
  brickMobile: {
    width: "48%",
    aspectRatio: 1,
    minHeight: 120,
    maxHeight: 150,
  },
  primaryBackground: {
    backgroundColor: Colors.primary,
  },
  greyBackground: {
    backgroundColor: Colors.grey,
  },
  whiteBackground: {
    backgroundColor: Colors.white,
  },
  brickText: {
    color: Colors.black,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Spacing.md + 1,
  },
  brickTextSmall: {
    fontSize: Typography.fontSize.sm,
  },
  brickTextBase: {
    fontSize: Typography.fontSize.base,
  },
  brickIcon: {
    resizeMode: "contain",
    width: 40,
    height: 40,
  },
});
