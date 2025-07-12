import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ThemedList from "../components/ThemedList";
import CustomBottomSheet, { Ref } from "../components/CustomBottomSheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { UpdateFormDataProps } from "../types";
import { updateSpecificPurchase } from "../api/purchase";
type PurchasedItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  date: string;
};

type ItemList = {
  __v: number;
  _id: string;
  amount: number;
  createdAt: string; // ISO date string
  isDeleted: boolean;
  name: string;
  updatedAt: string; // ISO date string
  userId: string;
};

type PurchaseResponseHttp = {
  item: ItemList[];
  message: string;
};
type FormData = {
  id?: string;
  name: string;
  amount: string; // use string for input fields, even if number later
};

const recentpurchase = () => {
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuthStore();

  const data = queryClient.getQueryData<PurchaseResponseHttp>([
    "purchase",
    user?.id,
  ]);
  console.log(data);
  const [editRowMeta, setEditRowMeta] = useState<{
    rowMap: any;
    rowKey: string;
  } | null>(null);

  console.log(data);

  const [form, setForm] = useState<UpdateFormDataProps>({
    name: "",
    amount: "",
  });
  const handleChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDelete = (id: string) => {
    console.log("handleDelete");
    // setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (
    item: ItemList,
    rowMap: { [key: string]: { closeRow: () => void } },
    rowKey: string
  ) => {
    console.log("handleEdit");
    setForm({ id: item._id, name: item.name, amount: item.amount.toString() });
    setEditRowMeta({ rowMap, rowKey });
    // Auto-close swiped row

    handlePresentModalPress(item);
    // Alert.alert("Edit Item", `Editing ${item.name}`);
  };

  const bottomSheetModalRef = useRef<Ref>(null);

  const snapPoints = useMemo(() => ["45%"], []);

  const handlePresentModalPress = useCallback((item: ItemList) => {
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

  const mutation = useMutation<
    PurchaseResponseHttp, // TData (success response)
    Error, // TError
    UpdateFormDataProps // TVariables (arguments to mutate)
  >({
    mutationFn: (form: UpdateFormDataProps, accessToken: string) =>
      updateSpecificPurchase(form, accessToken),

    onSuccess: async (data) => {
      try {
        // ✅ 1. Invalidate so subscribers (e.g. index page) will refetch automatically
        await queryClient.invalidateQueries({ queryKey: ["purchase"] });

        // ✅ 2. Optionally fetch and refresh the cache immediately
        await queryClient.fetchQuery({
          queryKey: ["purchase", user?.id],
          queryFn: async () => {
            const res = await api.get(`/purchase?userID=${user?.id}`);
            return res.data;
          },
        });

        // ✅ 3. Clean up UI
        if (editRowMeta?.rowMap && editRowMeta.rowKey) {
          editRowMeta.rowMap[editRowMeta.rowKey]?.closeRow?.();
        }

        setEditRowMeta(null);
        bottomSheetModalRef.current?.dismiss();

        // ✅ 4. Notify user
        Alert.alert(data.message);
      } catch (err) {
        console.error("Error refreshing purchase data:", err);
        Alert.alert("Error", "Failed to refresh purchase data.");
      }
    },
    onError: (error: any) => {
      console.log("Response:", error?.response?.data);

      Alert.alert(
        "Logins failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  return (
    <ScrollView style={{ paddingHorizontal: 15 }}>
      <View style={{ alignItems: "flex-end", paddingVertical: 15 }}>
        <Text>Total Purchased: {data?.item.length}</Text>
      </View>
      <View>
        <ThemedList
          items={data?.item ?? []}
          handleDelete={(id) => handleDelete(id)}
          handleEdit={handleEdit}
        />
      </View>
      <CustomBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClosePress={handleCloseModalPress}
        inputChange={handleChange}
        form={form}
        isLoading={mutation.isPending}
        onSubmit={() => mutation.mutate(form, accessToken)}
        headerText="Edit Purchase"
      />
    </ScrollView>
  );
};

export default recentpurchase;

const styles = StyleSheet.create({});
