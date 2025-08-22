import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ThemedList from "../components/ThemedList";
import CustomBottomSheet from "../components/CustomBottomSheet";

import { useAuthStore } from "../store/useAuthStore";
import { useBottomSheet } from "../hooks/useBottomSheet";
import { useUpdatePurchase } from "../hooks/useUpdatePurchase";
import { useDeletePurchase } from "../hooks/useDeletePurchase";

import {
  FormDataProps,
  PurchaseFormData,
  PurchaseResponseHttp,
  PurchaseSchema,
  TPurchase,
  UpdateFormDataProps,
} from "../types";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const RecentPurchase = () => {
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuthStore();
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
  });

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
    reset,
  });

  const { mutation: deleteMutation } = useDeletePurchase({
    userId: user?.id,
    bottomSheetModalRef,
  });

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
    setValue("name", item.name);
    setValue("amount", item.amount.toString());
    setValue("id", item._id);
    // setForm({
    //   id: item._id,
    //   name: item.name,
    //   amount: item.amount.toString(),
    // });
    setEditRowMeta({ rowMap, rowKey });
    handlePresentModalPress(item);
  };

  const closeModal = () => {
    reset();
    handleCloseModalPress();
  };

  const onSubmit: SubmitHandler<PurchaseFormData> = (data) => {
    console.log(data);
    updateMutation.mutate({ form: data, accessToken: accessToken! });
  };

  return (
    <View>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text>Total Purchased: {data?.item.length ?? 0}</Text>
        </View>

        <ThemedList
          items={data?.item ?? []}
          handleDelete={(id) => handleDelete({ id })}
          handleEdit={handleEdit}
        />
      </ScrollView>

      <CustomBottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onClosePress={closeModal}
        isLoading={updateMutation.isPending}
        // onSubmit={() =>
        //   updateMutation.mutate({ form, accessToken: accessToken! })
        // }
        headerText="Edit Purchase"
        // zod
        control={control}
        // handleSubmit={() => handleSubmit(onSubmit)}
        errors={errors}
        reset={reset}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </View>
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
