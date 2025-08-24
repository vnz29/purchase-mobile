import { View, Text, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { logOutUser } from "../api/auth";

const settings = () => {
  const router = useRouter();
  const { user, accessToken, logout, isLoggedIn } = useAuthStore();
  console.log(accessToken);
  const mutate = useMutation({
    mutationFn: (accessToken: string) => logOutUser(accessToken),

    onSuccess: async (data) => {
      isLoggedIn(false);
      logout();
      router.replace("login");
    },
    onError: (error: any) => {
      console.log("Response:", error?.response?.data);

      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  return (
    <View
      style={{
        flex: 1,

        alignItems: "flex-end",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 70,
      }}
    >
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#34d399", // iOS-style blue
            height: 48,
            width: "100%",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => mutate.mutate(accessToken!)}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default settings;
