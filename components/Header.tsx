import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { Spacing } from "../constants/Spacing";
import { Typography } from "../constants/Typography";
import { Platform } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { TABLET_MIN_WIDTH, SMALL_SCREEN_WIDTH } from "@/constants/Contants";

interface HeaderProps {
  showBack?: boolean;
  showHome?: boolean;
  isHome?: boolean;
}

const logo = require("../assets/images/auchan-logo.png");
const googlePlay = require("@/assets/images/google-play.png");

export default function Header({
  showBack = false,
  showHome = false,
  isHome = false,
}: HeaderProps) {
  const { width } = useWindowDimensions();
  const apkUrl = "https://expo.dev/artifacts/eas/5pWZibpMLaEgjw9EZw6nG2.apk";
  const isSmallScreen = width < SMALL_SCREEN_WIDTH;
  const isTablet = width >= TABLET_MIN_WIDTH;
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <Pressable
            onPress={() => {
              if (navigation.canGoBack?.()) {
                navigation.goBack();
              } else {
                router.push("/");
              }
            }}
            style={[
              styles.navButton,
              {
                width: isSmallScreen ? 90 : 140,
              },
            ]}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="arrow-back"
                size={isSmallScreen ? 24 : 32}
                color="white"
              />
              <Text
                style={[
                  styles.navButtonText,
                  isSmallScreen && styles.navSmallButtonText,
                ]}
              >
                Back
              </Text>
            </View>
          </Pressable>
        )}
        {showHome && (
          <Link
            href={"/"}
            asChild
            style={{
              width: isSmallScreen ? 90 : 140,
            }}
          >
            <Pressable style={styles.navButton}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="home"
                  size={isSmallScreen ? 24 : 32}
                  color="white"
                />

                <Text
                  style={[
                    styles.navButtonText,
                    isSmallScreen && styles.navSmallButtonText,
                  ]}
                >
                  Home
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
        {isHome && Platform.OS === "web" && (
          <Pressable
            onPress={() => {
              window.open(apkUrl, "_blank");
            }}
            style={styles.downloadButton}
          >
            <Image source={googlePlay} style={styles.downloadImage} />
            <View style={styles.textContainer}>
              <Text style={styles.downloadTextTop}>Get it on</Text>
              <Text style={styles.downloadTextBottom}>Google Play</Text>
            </View>
          </Pressable>
        )}
      </View>

      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
    borderRadius: Spacing.xl,
  },
  leftContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  logo: {
    width: 150,
    height: 60,
  },
  navButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  navButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
    marginLeft: Spacing.md,
  },
  navSmallButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    fontWeight: "bold",
    marginLeft: Spacing.sm,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: Typography.fontSize.xl,
    marginRight: Spacing.xs,
    color: Colors.white,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.black,
    width: 220,
    padding: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 6,
  },
  downloadImage: {
    width: 24,
    height: 24,
    marginRight: Spacing.sm,
    resizeMode: "contain",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  downloadTextTop: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
  },
  downloadTextBottom: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
  },
});
