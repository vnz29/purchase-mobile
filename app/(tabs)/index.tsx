import {
  Alert,
  Button,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ThemedCard from "../../components/ThemedCard";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import ThemedList from "../../components/ThemedList";
import ThemedText from "../../components/ThemedText";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedHomeView from "../../components/ThemedHomeView";
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet, { Ref } from "../../components/CustomBottomSheet";
type PurchasedItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};

const Index = () => {
  const [items, setItems] = useState<PurchasedItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      price: "$99.99",
      image: "https://via.placeholder.com/80",
      date: "June 25, 2025",
    },
    {
      id: "2",
      name: "Bluetooth Speaker",
      price: "$49.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "3",
      name: "Bluetooth Speaker",
      price: "$49.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "4",
      name: "Bluetooth Speaker",
      price: "$49.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "5",
      name: "Bluetooth Speaker",
      price: "$49.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "6",
      name: "Bluetooth Speaker",
      price: "$49.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "7",
      name: "Bluetooth Speaker",
      price: "$49.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
  ]);
  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item: PurchasedItem) => {
    Alert.alert("Edit Item", `Editing ${item.name}`);
  };
  // code for bottom sheet

  const bottomSheetModalRef = useRef<Ref>(null);

  const snapPoints = useMemo(() => ["45%"], []);

  const handlePresentModalPress = useCallback(() => {
    console.log("hello");
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    console.log("hello1");
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet changed to index:", index);
  }, []);

  return (
    <ThemedHomeView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 600 }}>Dashboard</Text>
        </View>
        <ThemedCard
          style={{ paddingHorizontal: 20, paddingVertical: 20, height: 150 }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            {/* Top content */}
            <View>
              <Text style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
                Welcome, User
              </Text>
            </View>

            {/* Bottom-right content */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "white", fontSize: 14 }}>
                Total spent today
              </Text>
              <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                PHP 123.45
              </Text>
            </View>
          </View>
        </ThemedCard>
        <View>
          <Text style={{ paddingVertical: 10, fontSize: 16, fontWeight: 600 }}>
            Product Purchased:
          </Text>
          <ThemedList
            items={items}
            handleDelete={(id) => handleDelete(id)}
            handleEdit={(id) => handleEdit(id)}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handlePresentModalPress}
      >
        <Octicons name="diff-added" size={18} color="white" />
      </TouchableOpacity>
      {/* <Button title="Present Modal" color="black" /> */}
      <CustomBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClosePress={handleCloseModalPress}
      />
    </ThemedHomeView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    backgroundColor: "#34d399",
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    right: 20,
    // transform: [{ translateX: -30 }], // Half the width
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
