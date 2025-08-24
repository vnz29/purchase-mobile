import { StyleSheet } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
type ItemsProps = {
  __v: number;
  _id: string;
  amount: number;
  createdAt: string; // ISO date string
  isDeleted: boolean;
  name: string;
  updatedAt: string; // ISO date string
  userId: string;
};
type FlatListProps = {
  items: ItemsProps[] | [];
  renderComponent: (item: ItemsProps) => React.ReactElement | null;
};
const ThemedFlatlist = ({ items, renderComponent }: FlatListProps) => {
  return (
    <FlatList
      data={items.slice(0, 7)}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => renderComponent(item)}
      scrollEnabled={false}
    />
  );
};

export default ThemedFlatlist;

const styles = StyleSheet.create({});
