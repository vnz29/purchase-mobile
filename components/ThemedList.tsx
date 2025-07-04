import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
type ListTypeProps = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};
type ThemeListProps = {
  items: ListTypeProps[];
  handleDelete: (id: string) => void;
  handleEdit: (id: ListTypeProps) => void;
};
const ThemedList = ({ items, handleDelete, handleEdit }: ThemeListProps) => {
  const renderItem = ({ item }: ListRenderItemInfo<ListTypeProps>) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        <View>
          <Text style={styles.date}>Purchased on {item.date}</Text>
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = ({ item }: ListRenderItemInfo<ListTypeProps>) => (
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
      scrollEnabled={false}
    />
  );
};

export default ThemedList;

const styles = StyleSheet.create({
  list: {
    // padding: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginBottom: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 6,
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
    marginBottom: 40,
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
