import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Tabs, useNavigation, useRouter } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { DrawerNavigationProp } from "@react-navigation/drawer";

const TabLayout = () => {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#34d399",
        freezeOnBlur: true,

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
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push("settings")}>
            <Ionicons name="menu" size={28} color="#34d399" />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          paddingRight: 15, // ✅ add right padding
        },
        headerLeftContainerStyle: {
          paddingLeft: 15, // ✅ add right padding
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "",

          tabBarIcon: ({ focused }) => (
            <Octicons
              name="person"
              size={24}
              color={focused ? "#34d399" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Purchase History",
          headerTitle: "",

          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="money-check"
              size={24}
              color={focused ? "#34d399" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          headerTitle: "",
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="circle-question"
              size={24}
              color={focused ? "#34d399" : "gray"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
