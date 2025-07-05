import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
type ItemsProps = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};
type FlatListProps = {
  items: ItemsProps[];
  renderComponent: (item: ItemsProps) => React.ReactElement | null;
};
const ThemedFlatlist = ({ items, renderComponent }: FlatListProps) => {
  return (
    <FlatList
      data={items.slice(0, 7)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => renderComponent(item)}
      scrollEnabled={false}
    />
  );
};

export default ThemedFlatlist;

const styles = StyleSheet.create({});
