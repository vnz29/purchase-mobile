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
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
type ThemedSafeAreaProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
} & ViewProps;
const ThemedSafeArea = ({ style, children, ...props }: ThemedSafeAreaProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    >
      <SafeAreaView>{children}</SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ThemedSafeArea;
