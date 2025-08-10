import {
  ActivityIndicator,
  Alert,
  Button,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ThemedCard from "../../../components/ThemedCard";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import ThemedList from "../../../components/ThemedList";
import ThemedText from "../../../components/ThemedText";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedHomeView from "../../../components/ThemedHomeView";
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet, { Ref } from "../../../components/CustomBottomSheet";
import ThemedFlatlist from "../../../components/ThemedFlatlist";
import { Link, useFocusEffect } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios";
import { useAuthStore } from "../../../store/useAuthStore";
import * as SecureStore from "expo-secure-store";
import { useBottomSheet } from "../../../hooks/useBottomSheet";
import { getCurrentPurchase } from "../../../api/purchase";
import { FormDataProps, PurchaseResponseHttp, TPurchase } from "../../../types";

const Index = () => {
  const [form, setForm] = useState<FormDataProps>({
    name: "",
    amount: "",
  });
  const { user, accessToken } = useAuthStore();

  const queryClient = useQueryClient();
  const {
    bottomSheetModalRef,
    snapPoints,
    handleCloseModalPress,
    handlePresentModalPress,
  } = useBottomSheet(["45%"]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet changed to index:", index);
  }, []);

  const handleChange = (key: keyof FormDataProps, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const name = form.name;
      const amount = parseFloat(form.amount);

      const res = await api.post("/purchase/addPurchase", {
        name,
        amount,
        userID: user?.id,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchase"] });
      bottomSheetModalRef.current?.dismiss();
      Alert.alert("Product successfully added");
    },
    onError: (error: any) => {
      console.log("Response:", error?.response?.data);

      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  const { data, isLoading } = useQuery<PurchaseResponseHttp>({
    queryKey: ["purchase", user?.id],
    queryFn: () => getCurrentPurchase(accessToken!, user?.id!),
  });

  const renderItem = (item: TPurchase) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.amount}</Text>
        </View>
        <View>
          <Text style={styles.date}>
            Purchased on{" "}
            {new Date(item.createdAt).toLocaleDateString("en-CA", {
              timeZone: "Asia/Manila",
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedHomeView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 600 }}>Dashboard</Text>
        </View>
        <Button
          title="Clear SecureStore"
          onPress={async () => {
            await SecureStore.deleteItemAsync("refreshToken");
            alert("SecureStore cleared");
          }}
        />
        <ThemedCard
          style={{ paddingHorizontal: 20, paddingVertical: 20, height: 150 }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            {/* Top content */}
            <View>
              <Text style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
                Welcome, {user?.username}
              </Text>
            </View>

            {/* Bottom-right content */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "white", fontSize: 14 }}>
                Total spent today
              </Text>
              <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                {data?.item.reduce((sum: number, item) => sum + item.amount, 0)}
              </Text>
            </View>
          </View>
        </ThemedCard>
        <View
          style={{
            backgroundColor: "#fff",
            marginVertical: 10,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 700 }}>
              Product Purchased:
            </Text>
            <Link href="/recentpurchase">See all</Link>
          </View>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <ThemedFlatlist
              items={data?.item ?? []}
              renderComponent={renderItem}
            />
          )}

          {/* <ThemedList
            items={items}r
            handleDelete={(id) => handleDelete(id)}
            handleEdit={(id) => handleEdit(id)}
          /> */}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => handlePresentModalPress()}
      >
        <Octicons name="diff-added" size={18} color="white" />
      </TouchableOpacity>
      {/* <Button title="Present Modal" color="black" /> */}
      <CustomBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClosePress={handleCloseModalPress}
        inputChange={handleChange}
        form={form}
        isLoading={mutation.isPending}
        onSubmit={() => mutation.mutate()}
        headerText="Add Purchase"
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
  // design for flatlist

  list: {
    // padding: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    // marginBottom: 10,
    // borderRadius: 8,
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
    fontSize: 14,
    fontWeight: 500,
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
