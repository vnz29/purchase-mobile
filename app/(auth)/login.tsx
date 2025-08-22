import {
  ActivityIndicator,
  Alert,
  Button,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { AuthSessionResult, makeRedirectUri } from "expo-auth-session";
import ThemedSafeArea from "../../components/ThemedSafeArea";
// zod and react hook

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { LoginHttpResponse } from "../../types";
WebBrowser.maybeCompleteAuthSession();

const userSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." }),
});
type UserFormType = z.infer<typeof userSchema>;

type GoogleUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

const login = () => {
  const [value, setValue] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setTokens, isLoggedIn } = useAuthStore();
  // const redirectUri = makeRedirectUri({
  //   useProxy: true,
  // });

  const mutation = useMutation<
    LoginHttpResponse, // TData: response data type
    AxiosError, // TError: error type
    UserFormType // TVariables: data passed to mutate
  >({
    mutationFn: async (variables) => {
      const res = await api.post("/user/login", variables);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      setUser(data);
      isLoggedIn(true);
      setTokens(data.accessToken, data.refreshToken);
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleLogin = (e: GestureResponderEvent) => {
    console.log("login button clicked");
  };
  const [users, setUsers] = useState<GoogleUser | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "612895319536-5l11nlkn5199hoie89a120acab7cg0d5.apps.googleusercontent.com",
    androidClientId:
      "612895319536-s8ir5810lisv322uipufl4fqfmu1ca4k.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({
      scheme: "purchase-mobile",
    }),
    ...{ useProxy: true },
  });
  console.log("hello");
  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: GoogleUser = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit: SubmitHandler<UserFormType> = (data) => mutation.mutate(data);

  return (
    <ThemedSafeArea style={styles.container}>
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
        {/* <ThemedTextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        /> */}
        <Controller
          control={control}
          name="username"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Username"
              />
              {error && <Text style={{ color: "red" }}>{error.message}</Text>}
            </>
          )}
        />
      </View>
      <View>
        {/* <ThemedTextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        /> */}
        <Controller
          control={control}
          name="password"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Username"
              />
              {error && <Text style={{ color: "red" }}>{error.message}</Text>}
            </>
          )}
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
            onPress={handleSubmit(onSubmit)}
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
      {/* <View style={[styles.itemCenter]}>
        <GoogleSignInButton />
      </View> */}
      {/* <Button
        title="Sign in with Google"
        onPress={() => {
          promptAsync();
        }}
        disabled={!request}
      /> */}
    </ThemedSafeArea>
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
