import { View, Image, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setSubProduct } from "@/store/productSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import {
  productDisplayNames,
  images,
  subOptions,
  TABLET_MIN_WIDTH,
} from "@/constants/Contants";

import BrickButton from "@/components/BrickButton";
import Header from "@/components/Header";

export default function SubProductScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const { product } = useSelector((state: RootState) => state.product);
  const { brand, model, generation, fuelType } = useSelector(
    (state: RootState) => state.vehicle
  );
  const hasVehicleConfig = !!brand && !!model && !!generation && !!fuelType;

  const displayName = product ? productDisplayNames[product] : "";
  const isTablet = width >= TABLET_MIN_WIDTH;

  if (!product || !displayName) return null;

  const handleSubProductPress = (subProduct: string) => {
    dispatch(setSubProduct(subProduct));
    if (hasVehicleConfig) {
      router.push("/Products");
    } else {
      router.push("/Brands");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header showBack showHome />
      <View style={styles.content}>
        {isTablet && (
          <View style={[styles.leftContainer]}>
            {images[displayName] && (
              <Image
                source={images[displayName]}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        )}

        <View style={styles.rightContainer}>
          {subOptions[displayName]?.map((sub, index) => (
            <BrickButton
              key={index}
              label={sub}
              maxWidth={isTablet ? 200 : 175}
              onPress={() => handleSubProductPress(sub)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Spacing.md,
    overflow: "hidden",
  },
  image: {
    height: "80%",
    borderRadius: Spacing.md,
    alignSelf: "center",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.lg,
    alignItems: "center",
  },
  brick: {
    backgroundColor: Colors.primary,
    borderRadius: Spacing.xs + 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    aspectRatio: 1,
    width: "100%",
    maxWidth: 200,
    maxHeight: 170,
  },
  brickText: {
    color: Colors.black,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
    textAlign: "center",
  },
});
