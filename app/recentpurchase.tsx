import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ThemedList from "../components/ThemedList";
import CustomBottomSheet from "../components/CustomBottomSheet";

import { useAuthStore } from "../store/useAuthStore";
import { useBottomSheet } from "../hooks/useBottomSheet";
import { useUpdatePurchase } from "../hooks/useUpdatePurchase";
import { useDeletePurchase } from "../hooks/useDeletePurchase";

import { UpdateFormDataProps, TPurchase, PurchaseResponseHttp } from "../types";

const RecentPurchase = () => {
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuthStore();
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const data = queryClient.getQueryData<PurchaseResponseHttp>([
    "purchase",
    user?.id,
  ]);

  const {
    bottomSheetModalRef,
    snapPoints,
    handleCloseModalPress,
    handlePresentModalPress,
  } = useBottomSheet(["45%"]);

  const {
    mutation: updateMutation,
    editRowMeta,
    setEditRowMeta,
  } = useUpdatePurchase({
    userId: user?.id,
    bottomSheetModalRef,
  });

  const { mutation: deleteMutation } = useDeletePurchase({
    userId: user?.id,
    bottomSheetModalRef,
  });

  const [form, setForm] = useState<UpdateFormDataProps>({
    name: "",
    amount: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDelete = ({ id }: { id: string }) => {
    if (!accessToken) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete the product purchase?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            deleteMutation.mutate({ id, accessToken });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = (
    item: TPurchase,
    rowMap: { [key: string]: { closeRow: () => void } },
    rowKey: string
  ) => {
    setForm({
      id: item._id,
      name: item.name,
      amount: item.amount.toString(),
    });
    setEditRowMeta({ rowMap, rowKey });
    handlePresentModalPress(item);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text>Total Purchased: {data?.item.length ?? 0}</Text>
      </View>

      <ThemedList
        items={data?.item ?? []}
        handleDelete={(id) => handleDelete({ id })}
        handleEdit={handleEdit}
      />

      <CustomBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onClosePress={handleCloseModalPress}
        inputChange={handleChange}
        form={form}
        isLoading={updateMutation.isPending}
        onSubmit={() =>
          updateMutation.mutate({ form, accessToken: accessToken! })
        }
        headerText="Edit Purchase"
      />
    </ScrollView>
  );
};

export default RecentPurchase;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  header: {
    alignItems: "flex-end",
    paddingVertical: 15,
  },
});
