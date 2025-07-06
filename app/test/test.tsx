// app/(auth)/login.tsx
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", { email, password });
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      router.replace("/");
    },
    onError: (error: any) => {
      Alert.alert("Login failed", error.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {mutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button title="Login" onPress={() => mutation.mutate()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
  },
});


tabs/profile.tsx

<Button
  title="Logout"
  onPress={() => {
    api.post("/auth/logout"); // optionally clear cookie
    useAuthStore.getState().logout();
    router.replace("/login");
  }}
/>


// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "./lib/axios";
import { useAuthStore } from "./store/useAuthStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { user, setUser, isLoading, setIsLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  if (isLoading) {
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
            initialRouteName={user ? "(tabs)" : "(auth)"}
            screenOptions={{ headerShown: false }}
          />
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}


// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // set true in prod with HTTPS
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user: { id: user._id, email: user.email }, accessToken });
});

// GET /api/auth/refresh
app.get("/api/auth/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken: newAccessToken });
  });
});

// GET /api/auth/me
app.get("/api/auth/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    const user = await User.findById(decoded.id).select("id email");
    res.json({ user, accessToken: token });
  });
});
