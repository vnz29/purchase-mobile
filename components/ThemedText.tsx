import {
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  useColorScheme,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "../constant/Colors";
type ThemedTextProps = {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
} & TextProps;
const ThemedText = ({ style, ...props }: ThemedTextProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  return <Text style={[{ color: theme.text }, style]} {...props} />;
};

export default ThemedText;
