import {
  ActivityIndicator,
  Alert,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedText from "../../components/ThemedText";
import ThemedButton from "../../components/ThemedButton";
import ThemedView from "../../components/ThemedView";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { Link, router } from "expo-router";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

const login = () => {
  const [value, setValue] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/user/login", { username, password });

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      return res.data;
    },
    onSuccess: (data) => {
      console.log("hello");
      console.log(data);
      setUser(data);
      router.replace("/");
    },
    onError: (error: any) => {
      console.log("Response:", error?.response?.data);

      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleLogin = (e: GestureResponderEvent) => {
    console.log("login button clicked");
  };
  return (
    <ThemedView style={styles.container}>
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
      <View
        style={{
          paddingBottom: 10,
        }}
      >
        <ThemedText style={styles.intro}>Track your spending!</ThemedText>
      </View>
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
            <ThemedText style={styles.fabText}>Login</ThemedText>
          </ThemedButton>
        )}
      </View>
      <View style={[styles.itemCenter, { marginVertical: 40 }]}>
        <ThemedText style={styles.forgotText}>Forgot password?</ThemedText>
      </View>
      <View style={[styles.itemCenter, { marginBottom: 40 }]}>
        <ThemedText style={styles.signUpText}>
          Don't have an account?
          <Link href={"/signup"} style={styles.signUpLink}>
            Sign up
          </Link>
        </ThemedText>
      </View>
      <View style={[styles.itemCenter]}>
        <GoogleSignInButton />
      </View>
    </ThemedView>
  );
};

export default login;
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
