import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { deleteSpecificPurchase } from "../api/purchase";
import { DeletePurchase, DeletePurchaseResponseHttp } from "../types";
import { RefObject, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type EditRowMeta = {
  rowMap: any;
  rowKey: string;
} | null;

type UseDeletePurchaseProps = {
  userId?: string;
  bottomSheetModalRef: RefObject<BottomSheetModal | null>; //
};

export function useDeletePurchase({
  userId,
  bottomSheetModalRef,
}: UseDeletePurchaseProps) {
  const queryClient = useQueryClient();
  const [editRowMeta, setEditRowMeta] = useState<EditRowMeta>(null);

  const mutation = useMutation<
    DeletePurchaseResponseHttp,
    Error,
    DeletePurchase
  >({
    mutationFn: deleteSpecificPurchase,
    onSuccess: async (data) => {
      try {
        if (!userId) return;

        await queryClient.invalidateQueries({ queryKey: ["purchase", userId] });

        if (editRowMeta?.rowMap && editRowMeta.rowKey) {
          editRowMeta.rowMap[editRowMeta.rowKey]?.closeRow?.();
        }
        setEditRowMeta(null);
        bottomSheetModalRef.current?.dismiss();

        Alert.alert(data.message);
      } catch (err) {
        console.error("Error refreshing purchase data:", err);
        Alert.alert("Error", "Failed to refresh purchase data.");
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Delete failed",
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
