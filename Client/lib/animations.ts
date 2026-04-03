import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function useScalePress(defaultScale = 1, pressedScale = 0.96) {
  const scale = useSharedValue(defaultScale);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(pressedScale, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(defaultScale, { duration: 160 });
  };

  return [animatedStyle, handlePressIn, handlePressOut] as const;
}
