import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          // headerStyle: {
          //   backgroundColor: "#34d399",
          // },
          headerLeft: () => (
            <Text
              style={{
                fontSize: 20,
                color: "#34d399",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Spendly
            </Text>
          ),
          headerRight: () => <Ionicons name="menu" size={28} color="#34d399" />,
          headerRightContainerStyle: {
            paddingRight: 15, // ✅ add right padding
          },
          headerLeftContainerStyle: {
            paddingLeft: 15, // ✅ add right padding
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "" }} />
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
