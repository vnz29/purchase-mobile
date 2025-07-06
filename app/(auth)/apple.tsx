import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ListRenderItemInfo,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons } from "@expo/vector-icons";

type PurchasedItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};

const Index: React.FC = () => {
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
  ]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item: PurchasedItem) => {
    Alert.alert("Edit Item", `Editing ${item.name}`);
  };

  const renderItem = ({ item }: ListRenderItemInfo<PurchasedItem>) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.date}>Purchased on {item.date}</Text>
      </View>
    </View>
  );

  const renderHiddenItem = ({ item }: ListRenderItemInfo<PurchasedItem>) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editBtn]}
        onPress={() => handleEdit(item)}
      >
        <MaterialIcons name="edit" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteBtn]}
        onPress={() => handleDelete(item.id)}
      >
        <MaterialIcons name="delete" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-100}
      disableRightSwipe
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  textContainer: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: "green",
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    marginLeft: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "#007bff",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
  },
});

export default Index;
