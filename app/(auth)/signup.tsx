import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import Toast from "react-native-toast-message";
import ThemedSafeArea from "../../components/ThemedSafeArea";
import { router } from "expo-router";

const signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/user/signup", {
        username,
        password,
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Account Succesfully created",
        visibilityTime: 1000,
      });
      router.replace("/login");
    },
  });

  return (
    <ThemedSafeArea style={styles.container}>
      <View>
        <View
          style={[
            styles.itemCenter,
            {
              paddingBottom: 50,
              paddingTop: 30,

              margin: 0,
            },
          ]}
        >
          <ThemedText style={[styles.title]}>Spendly</ThemedText>
        </View>
        <View>
          <Text>Create an account</Text>
        </View>
        <View>
          <View>
            <ThemedTextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View>
            <ThemedTextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={[styles.itemCenter, { marginTop: 20 }]}>
            {/* <ThemedButton onPress={handleLogin} style={styles.loginButton}>
          <ThemedText style={styles.fabText}>Login</ThemedText>
        </ThemedButton> */}

            {mutation.isPending ? (
              <ActivityIndicator />
            ) : (
              <ThemedButton
                onPress={() => mutation.mutate()}
                style={styles.loginButton}
              >
                <ThemedText style={styles.fabText}>Create</ThemedText>
              </ThemedButton>
            )}
          </View>
        </View>
      </View>
    </ThemedSafeArea>
  );
};

export default signup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    // justifyContent: "center",
    backgroundColor: "#fff",
  },
  itemCenter: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34d399",
  },
  intro: {
    color: "#4A4A4A",
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EDEFF3",
  },
  loginButton: {
    backgroundColor: "#34d399",
    width: "100%",
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    paddingVertical: 10,
    borderRadius: 10,
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
  },
  forgotText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#34d399",
  },
  signUpText: {
    fontSize: 12,
    fontWeight: 300,
    color: "#4A4A4A",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: 600,
    color: "#34d399",
  },
});
