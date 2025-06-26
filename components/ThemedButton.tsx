import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "../constant/Colors";
type ThemedButtonProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
} & PressableProps;
const ThemedButton = ({ style, ...props }: ThemedButtonProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  return <Pressable style={style} {...props} />;
};

export default ThemedButton;

const styles = StyleSheet.create({});
