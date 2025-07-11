// app/_layout.tsx
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Colors } from "../constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/useAuthStore";
import * as SplashScreen from "expo-splash-screen";

// prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [appReady, setAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch(
          "http://192.168.100.163:3000/api/user/refreshToken",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!response.ok) {
          console.log("Refresh token invalid or expired");
          await SecureStore.deleteItemAsync("refreshToken");
          setIsAuthenticated(false);
          return;
        }

        // const { accessToken, refreshToken: newRefreshToken } =
        //   await response.json();
        const { accessToken, userId, username } = await response.json();

        // Save new tokens to Zustand + SecureStore
        //await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        useAuthStore.getState().setTokens(accessToken, refreshToken);
        useAuthStore.getState().setUser({ id: userId, username: username });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed", err);
        setIsAuthenticated(false);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    initAuth();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            initialRouteName={isAuthenticated ? "(tabs)" : "(auth)"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="recentpurchase"
              options={{
                headerShown: true,
                title: "Purchases",
                headerTitleAlign: "center",
              }}
            />
          </Stack>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
