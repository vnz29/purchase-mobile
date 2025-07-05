import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TabLayout = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleProfilePress = () => {
    try {
      bottomSheetModalRef.current?.present();
      console.log("Display bottom sheet");
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return (
    <Tabs
      screenOptions={{
        // headerStyle: {
        //   backgroundColor: "#34d399",
        // },
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
        headerRight: () => <Ionicons name="menu" size={28} color="#34d399" />,
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
