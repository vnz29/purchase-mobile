import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import api from "../lib/axios";
import { updateSpecificPurchase } from "../api/purchase";
import { PurchaseResponseHttp, UpdatePurchaseInput } from "../types";
import { RefObject, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type EditRowMeta = {
  rowMap: any;
  rowKey: string;
} | null;

type UseUpdatePurchaseProps = {
  userId?: string;
  bottomSheetModalRef: RefObject<BottomSheetModal | null>; //
  reset: () => void;
};

export function useUpdatePurchase({
  userId,
  bottomSheetModalRef,
  reset,
}: UseUpdatePurchaseProps) {
  const queryClient = useQueryClient();
  const [editRowMeta, setEditRowMeta] = useState<EditRowMeta>(null);

  const mutation = useMutation<
    PurchaseResponseHttp,
    Error,
    UpdatePurchaseInput
  >({
    mutationFn: updateSpecificPurchase,
    onSuccess: async () => {
      try {
        if (!userId) return;

        await queryClient.invalidateQueries({ queryKey: ["purchase", userId] });

        if (editRowMeta?.rowMap && editRowMeta.rowKey) {
          editRowMeta.rowMap[editRowMeta.rowKey]?.closeRow?.();
        }
        reset();
        setEditRowMeta(null);
        bottomSheetModalRef.current?.dismiss();
      } catch (err) {
        console.error("Error refreshing purchase data:", err);
        Alert.alert("Error", "Failed to refresh purchase data.");
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Update failed",
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  return {
    mutation,
    editRowMeta,
    setEditRowMeta,
  };
}
