import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { BorderRadius, FontSize, Spacing, ThemeColors } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import { useScalePress } from "@/lib/animations";
import { hapticMedium } from "@/lib/haptics";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const [scaleStyle, pressIn, pressOut] = useScalePress(1, 0.92);
  const { colors } = useTheme();
  const s = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Animated.View style={[scaleStyle, style]}>
      <TouchableOpacity
        onPress={() => {
          hapticMedium();
          onPress();
        }}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={isDisabled}
        activeOpacity={1}
        style={[
          s.base,
          s[variant],
          s[`size_${size}`],
          isDisabled && s.disabled,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === "ghost" ? colors.primary : colors.white}
            size="small"
          />
        ) : (
          <>
            {icon}
            <Text
              style={[
                s.text,
                s[`text_${variant}`],
                s[`textSize_${size}`],
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: BorderRadius.md,
      gap: Spacing.sm,
    },
    primary: { backgroundColor: c.primary },
    secondary: {
      backgroundColor: c.surfaceLight,
      borderWidth: 1,
      borderColor: c.border,
    },
    danger: { backgroundColor: c.danger },
    ghost: { backgroundColor: "transparent" },
    disabled: { opacity: 0.5 },
    size_sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
    size_md: { paddingVertical: Spacing.md - 2, paddingHorizontal: Spacing.lg, minHeight: 50 },
    size_lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, minHeight: 56 },
    text: { fontWeight: "700" },
    text_primary: { color: c.white },
    text_secondary: { color: c.text },
    text_danger: { color: c.white },
    text_ghost: { color: c.primary },
    textSize_sm: { fontSize: FontSize.sm },
    textSize_md: { fontSize: FontSize.md },
    textSize_lg: { fontSize: FontSize.lg },
  });
