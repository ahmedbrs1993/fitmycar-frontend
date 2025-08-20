import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

export default function BrickButton({
  label,
  onPress,
  maxWidth = 200,
}: {
  label: string;
  onPress: () => void;
  maxWidth?: number;
}) {
  return (
    <Pressable style={[styles.brick, { maxWidth }]} onPress={onPress}>
      <Text style={styles.brickText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brick: {
    backgroundColor: Colors.primary,
    borderRadius: Spacing.xs + 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    aspectRatio: 1,
    width: "100%",
    maxHeight: 170,
  },
  brickText: {
    color: Colors.black,
    fontWeight: "bold",
    fontSize: Typography.fontSize.base,
    textAlign: "center",
  },
});
