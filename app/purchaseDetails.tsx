import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import ThemedCard from "../components/ThemedCard";

const purchaseDetails = () => {
  const params = useLocalSearchParams();
  const purchase = params.purchase
    ? JSON.parse(params.purchase as string)
    : null;
  const date = new Date(purchase.createdAt);
  const formatted = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  console.log("hello");
  return (
    <View
      style={{
        padding: 15,
      }}
    >
      <View
        style={{
          gap: 10,
          backgroundColor: "#fff",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 8,
          borderColor: "green",
          borderWidth: 1,
        }}
      >
        <View>
          <Text>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Purchased: {purchase.name}
            </Text>
            <Text style={{ fontWeight: "normal", fontSize: 14 }}></Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "green" }}>
            ₱{purchase.amount}
          </Text>

          <Text style={{ color: "#666" }}>{formatted}</Text>
        </View>
      </View>
    </View>
  );
};

export default purchaseDetails;

const styles = StyleSheet.create({});
