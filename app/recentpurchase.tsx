import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ThemedList from "../components/ThemedList";
import CustomBottomSheet, { Ref } from "../components/CustomBottomSheet";
type PurchasedItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};

const recentpurchase = () => {
  const [items, setItems] = useState<PurchasedItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      price: "$99.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
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
      name: "Smart Watch",
      price: "$129.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "4",
      name: "Wireless Mouse",
      price: "$19.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "5",
      name: "Mechanical Keyboard",
      price: "$89.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "6",
      name: "USB-C Hub",
      price: "$34.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "7",
      name: "Webcam",
      price: "$59.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "8",
      name: "Portable SSD",
      price: "$119.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "9",
      name: "Noise Cancelling Earbuds",
      price: "$149.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "10",
      name: "Smartphone Stand",
      price: "$14.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "11",
      name: "Laptop Cooling Pad",
      price: "$39.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "12",
      name: "Gaming Chair",
      price: "$199.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "13",
      name: "Desk Lamp",
      price: "$24.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "14",
      name: "HDMI Cable",
      price: "$9.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "15",
      name: "Wireless Charger",
      price: "$29.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "16",
      name: "Smart LED Strip",
      price: "$39.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "17",
      name: "Fitness Tracker",
      price: "$59.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "18",
      name: "Tablet Stand",
      price: "$19.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "19",
      name: "Mini Projector",
      price: "$149.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
    {
      id: "20",
      name: "VR Headset",
      price: "$299.99",
      image: "https://via.placeholder.com/80",
      date: "June 20, 2025",
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<PurchasedItem | null>(null);
  const handleDelete = (id: string) => {
    console.log("handleDelete");
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item: PurchasedItem) => {
    console.log("handleEdit");
    setSelectedItem(item);
    handlePresentModalPress(item);
    // Alert.alert("Edit Item", `Editing ${item.name}`);
  };

  const bottomSheetModalRef = useRef<Ref>(null);

  const snapPoints = useMemo(() => ["45%"], []);

  const handlePresentModalPress = useCallback((item: PurchasedItem) => {
    console.log("handlePresentModalPress");
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    console.log("handleCloseModalPress");
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet changed to index:", index);
  }, []);
  console.log("test2");
  return (
    <ScrollView style={{ paddingHorizontal: 15 }}>
      <View style={{ alignItems: "flex-end", paddingVertical: 15 }}>
        <Text>Total Purchased: 20</Text>
      </View>
      <View>
        <ThemedList
          items={items}
          handleDelete={(id) => handleDelete(id)}
          handleEdit={(id) => handleEdit(id)}
        />
      </View>
      <CustomBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClosePress={handleCloseModalPress}
        item={selectedItem}
      />
    </ScrollView>
  );
};

export default recentpurchase;

const styles = StyleSheet.create({});
