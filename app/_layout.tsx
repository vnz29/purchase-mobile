import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Slot, Stack } from "expo-router";
import { Colors } from "../constant/Colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const RootLayout = () => {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <>
      {/* <StatusBar style="auto" />
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

        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack> */}

      <Slot initialRouteName={isAuthenticated ? "(dashboard)" : "(auth)"} />
      {/* <Stack>
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack> */}
    </>
  );
  // const [isReady, setIsReady] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   async function checkAuth() {
  //     // Fake auth check delay
  //     await new Promise((r) => setTimeout(r, 5000));

  //     const userLoggedIn = false; // Replace with real auth logic
  //     setIsAuthenticated(userLoggedIn);
  //     setIsReady(true);
  //     console.log(userLoggedIn);
  //     if (!userLoggedIn) {
  //       router.replace("/login");
  //     }
  //   }
  //   checkAuth();
  // }, []);

  // if (!isReady) {
  //   // Can show a splash screen or loader here
  //   return null;
  // }

  // return <Slot />;
};

export default RootLayout;

const styles = StyleSheet.create({});
