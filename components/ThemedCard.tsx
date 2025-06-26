import React from "react";
import { StyleProp, ViewProps, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ThemedCardProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
} & ViewProps;

const ThemedCard = ({ style, children, ...props }: ThemedCardProps) => {
  return (
    <LinearGradient
      colors={["#34d399", "#10b981"]}
      start={{ x: 0.1, y: 0.2 }}
      end={{ x: 1, y: 0.5 }}
      style={[{ borderRadius: 12, padding: 16 }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default ThemedCard;
