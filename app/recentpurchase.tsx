// import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
// import React, { useCallback, useMemo, useRef, useState } from "react";
// import ThemedList from "../components/ThemedList";
// import CustomBottomSheet, { Ref } from "../components/CustomBottomSheet";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "../lib/axios";
// import { useAuthStore } from "../store/useAuthStore";
// import {
//   DeletePurchase,
//   DeletePurchaseResponseHttp,
//   ItemList,
//   PurchaseResponseHttp,
//   UpdateFormDataProps,
//   UpdatePurchaseInput,
// } from "../types";
// import {
//   deleteSpecificPurchase,
//   updateSpecificPurchase,
// } from "../api/purchase";
// import { useBottomSheet } from "../hooks/useBottomSheet";

// type FormData = {
//   id?: string;
//   name: string;
//   amount: string; // use string for input fields, even if number later
// };

// const recentpurchase = () => {
//   const queryClient = useQueryClient();
//   const { user, accessToken } = useAuthStore();

//   const data = queryClient.getQueryData<PurchaseResponseHttp>([
//     "purchase",
//     user?.id,
//   ]);
//   const {
//     bottomSheetModalRef,
//     snapPoints,
//     handleCloseModalPress,
//     handlePresentModalPress,
//   } = useBottomSheet(["45%"]);

//   const [editRowMeta, setEditRowMeta] = useState<{
//     rowMap: any;
//     rowKey: string;
//   } | null>(null);

//   const [form, setForm] = useState<UpdateFormDataProps>({
//     name: "",
//     amount: "",
//   });

//   const handleChange = (key: keyof FormData, value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleDelete = ({ id, accessToken }: DeletePurchase) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete the product purchase?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "OK",
//           onPress: () => {
//             // 🗑️ Place your delete function here
//             deletePurchaseMutation.mutate({ id, accessToken: accessToken! });
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//     // setItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleEdit = (
//     item: ItemList,
//     rowMap: { [key: string]: { closeRow: () => void } },
//     rowKey: string
//   ) => {
//     console.log("handleEdit");
//     setForm({ id: item._id, name: item.name, amount: item.amount.toString() });
//     setEditRowMeta({ rowMap, rowKey });
//     // Auto-close swiped row

//     handlePresentModalPress(item);
//     // Alert.alert("Edit Item", `Editing ${item.name}`);
//   };

//   const handleSheetChanges = useCallback((index: number) => {
//     console.log("Sheet changed to index:", index);
//   }, []);

//   //update purchase
//   const mutation = useMutation<
//     PurchaseResponseHttp, // TData
//     Error, // TError
//     UpdatePurchaseInput
//   >({
//     mutationFn: updateSpecificPurchase,

//     onSuccess: async (data) => {
//       try {
//         // ✅ 1. Invalidate so subscribers (e.g. index page) will refetch automatically
//         await queryClient.invalidateQueries({ queryKey: ["purchase"] });

//         // ✅ 2. Optionally fetch and refresh the cache immediately
//         await queryClient.fetchQuery({
//           queryKey: ["purchase", user?.id],
//           queryFn: async () => {
//             const res = await api.get(`/purchase?userID=${user?.id}`);
//             return res.data;
//           },
//         });

//         // ✅ 3. Clean up UI
//         if (editRowMeta?.rowMap && editRowMeta.rowKey) {
//           editRowMeta.rowMap[editRowMeta.rowKey]?.closeRow?.();
//         }

//         setEditRowMeta(null);
//         bottomSheetModalRef.current?.dismiss();

//         // ✅ 4. Notify user
//       } catch (err) {
//         console.error("Error refreshing purchase data:", err);
//         Alert.alert("Error", "Failed to refresh purchase data.");
//       }
//     },
//     onError: (error: any) => {
//       console.log("Response:", error?.response?.data);

//       Alert.alert(
//         "Logins failed",
//         error.response?.data?.message || "Something went wrong"
//       );
//     },
//   });

//   //delete purchase

//   const deletePurchaseMutation = useMutation<
//     DeletePurchaseResponseHttp, // TData
//     Error, // TError
//     DeletePurchase
//   >({
//     mutationFn: deleteSpecificPurchase,

//     onSuccess: async (data) => {
//       try {
//         // ✅ 1. Invalidate so subscribers (e.g. index page) will refetch automatically
//         await queryClient.invalidateQueries({ queryKey: ["purchase"] });

//         // ✅ 2. Optionally fetch and refresh the cache immediately
//         await queryClient.fetchQuery({
//           queryKey: ["purchase", user?.id],
//           queryFn: async () => {
//             const res = await api.get(`/purchase?userID=${user?.id}`);
//             return res.data;
//           },
//         });

//         // ✅ 3. Clean up UI
//         if (editRowMeta?.rowMap && editRowMeta.rowKey) {
//           editRowMeta.rowMap[editRowMeta.rowKey]?.closeRow?.();
//         }

//         setEditRowMeta(null);
//         bottomSheetModalRef.current?.dismiss();

//         // ✅ 4. Notify user
//         Alert.alert(data.message);
//       } catch (err) {
//         console.error("Error refreshing purchase data:", err);
//         Alert.alert("Error", "Failed to refresh purchase data.");
//       }
//     },
//     onError: (error: any) => {
//       console.log("Response:", error?.response?.data);

//       Alert.alert(
//         "Logins failed",
//         error.response?.data?.message || "Something went wrong"
//       );
//     },
//   });
//   return (
//     <ScrollView style={{ paddingHorizontal: 15 }}>
//       <View style={{ alignItems: "flex-end", paddingVertical: 15 }}>
//         <Text>Total Purchased: {data?.item.length}</Text>
//       </View>
//       <View>
//         <ThemedList
//           items={data?.item ?? []}
//           handleDelete={(id) => handleDelete({ id, accessToken: accessToken! })}
//           handleEdit={handleEdit}
//         />
//       </View>
//       <CustomBottomSheet
//         ref={bottomSheetModalRef}
//         snapPoints={snapPoints}
//         onChange={handleSheetChanges}
//         onClosePress={handleCloseModalPress}
//         inputChange={handleChange}
//         form={form}
//         isLoading={mutation.isPending}
//         onSubmit={() =>
//           mutation.mutate({ form: form, accessToken: accessToken! })
//         }
//         headerText="Edit Purchase"
//       />
//     </ScrollView>
//   );
// };

// export default recentpurchase;

// const styles = StyleSheet.create({});

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

import { UpdateFormDataProps, ItemList, PurchaseResponseHttp } from "../types";

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
    item: ItemList,
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
