import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  useColorScheme,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "../constant/Colors";
type ThemedTextInputProps = {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
} & TextInputProps;
const ThemedTextInput = ({ style, ...props }: ThemedTextInputProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  return <TextInput style={[{ color: theme.text }, style]} {...props} />;
};

export default ThemedTextInput;
