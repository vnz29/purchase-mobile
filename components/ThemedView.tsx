import {
  StyleProp,
  Text,
  useColorScheme,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "../constant/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type ThemedViewProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
} & ViewProps;
const ThemedView = ({ style, ...props }: ThemedViewProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;
