import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ThemedCard from "../../components/ThemedCard";

const Index = () => {
  return (
    <View>
      <View>
        <Text>Dashboard</Text>
      </View>
      <ThemedCard>
        <Text>Dashboard</Text>
      </ThemedCard>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  rootCard: {
    height: 300,
  },
});
