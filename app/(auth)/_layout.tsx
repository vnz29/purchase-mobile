import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constant/Colors";

const AuthLayout = () => {
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.navBackground,
          },
          headerRight: () => (
            <Pressable
              onPress={() => alert("Global Help button pressed")}
              style={{ marginRight: 0 }}
            >
              <Ionicons name="help-circle-outline" size={20} color="white" />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthLayout;
