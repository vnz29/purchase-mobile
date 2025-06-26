import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ThemedCard from "../../components/ThemedCard";

const Index = () => {
  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
