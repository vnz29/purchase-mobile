import { useCallback, useMemo, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { ItemList } from "../types";

export const useBottomSheet = (snapPointsInput: string[] = ["45%"]) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => snapPointsInput, [snapPointsInput]);

  const handlePresentModalPress = useCallback((item?: ItemList) => {
    console.log("handlePresentModalPress");
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    console.log("handleCloseModalPress");
  }, []);

  // Dismiss on screen blur
  useFocusEffect(
    useCallback(() => {
      return () => {
        bottomSheetModalRef.current?.dismiss();
      };
    }, [])
  );

  return {
    bottomSheetModalRef,
    snapPoints,
    handlePresentModalPress,
    handleCloseModalPress,
  };
};
