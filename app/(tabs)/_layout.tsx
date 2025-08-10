import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../../store/useAuthStore"; // Adjust this path
import { useMutation } from "@tanstack/react-query";
import { logOutUser } from "../../api/auth";
export default function DrawerLayout() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuthStore();
  const mutate = useMutation({
    mutationFn: (accessToken: string) => logOutUser(accessToken),

    onSuccess: async (data) => {
      logout();
      router.replace("/login");
    },
    onError: (error: any) => {
      console.log("Response:", error?.response?.data);

      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  function CustomDrawerContent(props: any) {
    return (
      <View style={styles.container}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Default drawer items (screens) */}
          {props.children}
        </DrawerContentScrollView>

        {/* Logout button fixed at bottom */}
        <View style={styles.logoutContainer}>
          <DrawerItem
            label="Logout"
            onPress={() => mutate.mutate(accessToken!)}
          />
        </View>
      </View>
    );
  }

  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 50,
  },
});
