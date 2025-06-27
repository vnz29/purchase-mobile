import {
  Alert,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ThemedCard from "../../components/ThemedCard";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import ThemedList from "../../components/ThemedList";
import ThemedText from "../../components/ThemedText";

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
  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingVertical: 20 }}>
        <Text>Dashboard</Text>
      </View>
      <ThemedCard
        style={{ paddingHorizontal: 20, paddingVertical: 20, height: 150 }}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          {/* Top content */}
          <View>
            <Text>Welcome</Text>
          </View>

          {/* Bottom-right content */}
          <View style={{ alignItems: "flex-end" }}>
            <Text>Total spent today</Text>
            <Text>$123.45</Text>
          </View>
        </View>
      </ThemedCard>
      <View>
        <ThemedText>Product Purchased:</ThemedText>
        <ThemedList
          items={items}
          handleDelete={(id) => handleDelete(id)}
          handleEdit={(id) => handleEdit(id)}
        />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
