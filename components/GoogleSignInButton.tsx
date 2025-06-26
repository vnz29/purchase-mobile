import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  GestureResponderEvent,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function GoogleSignInButton() {
  const handlePress = (event: GestureResponderEvent) => {
    console.log("Google Sign-In button pressed");
  };

  return (
    <View>
      <TouchableOpacity style={styles.googleButton} onPress={handlePress}>
        <Image
          source={{
            uri: "https://developers.google.com/identity/images/g-logo.png",
          }}
          style={{ width: 24, height: 24, marginRight: 10 }}
        />
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: "#4A4A4A",
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#4A4A4A",
    fontSize: 16,
    fontWeight: "500",
  },
});
