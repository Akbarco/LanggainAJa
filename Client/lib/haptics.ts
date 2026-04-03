import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export async function hapticMedium() {
  if (Platform.OS === "web") {
    return;
  }

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Ignore haptics failures so UI interactions still work.
  }
}
