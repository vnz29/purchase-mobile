import React, { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import ThemedButton from "./ThemedButton";
import ThemedText from "./ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CustomBottomSheetDatePickerProps } from "../types";
export type Ref = BottomSheetModal;

const CustomBottomSheetDatePicker = forwardRef<
  Ref,
  CustomBottomSheetDatePickerProps
>(
  (
    {
      snapPoints,
      handleUpdate,
      fromDate,
      toDate,
      isLoading,
      handleClick,
      headerText,
      onClosePress,
    },
    ref
  ) => {
    const [date, setDate] = useState<Date>(new Date());
    const [fromDateShowPicker, setFromDateShowPicker] =
      useState<boolean>(false);
    const [toDateShowPicker, setToDateShowPicker] = useState<boolean>(false);
    const onChange = (
      event: DateTimePickerEvent,
      selectedDate: Date,
      type: string
    ) => {
      if (Platform.OS === "android") {
        type === "from-date"
          ? setFromDateShowPicker(false)
          : setToDateShowPicker(false);
      }

      if (type === "from-date") handleUpdate(selectedDate, "from-date");
      else handleUpdate(selectedDate, "to-date");
    };

    const showDatePicker = (type: string) => {
      type === "from-date"
        ? setFromDateShowPicker(true)
        : setToDateShowPicker(true);
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        enablePanDownToClose={false}
        snapPoints={snapPoints}
        handleComponent={() => null}
        animationConfigs={{
          duration: 300,
        }}
        enableContentPanningGesture={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.modalHeader}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>{headerText}</Text>
            <TouchableOpacity onPress={onClosePress} style={styles.closeButton}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              value={fromDate.toString()}
              editable={false}
              pointerEvents="none"
            />
            <TouchableOpacity
              onPress={() => showDatePicker("from-date")}
              style={styles.icon}
            >
              <AntDesign name="calendar" size={24} color="black" />
            </TouchableOpacity>

            {fromDateShowPicker && (
              <DateTimePicker
                value={new Date(fromDate)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, d) => onChange(e, d!, "from-date")}
                maximumDate={new Date(toDate)}
              />
            )}
          </View>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              value={toDate.toString()}
              editable={false}
              pointerEvents="none"
            />
            <TouchableOpacity
              onPress={() => showDatePicker("to-date")}
              style={styles.icon}
            >
              <AntDesign name="calendar" size={24} color="black" />
            </TouchableOpacity>

            {toDateShowPicker && (
              <DateTimePicker
                value={new Date(toDate)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, d) => onChange(e, d!, "to-date")}
                maximumDate={new Date()}
              />
            )}
          </View>
          <View style={[styles.itemCenter, { marginTop: 20 }]}>
            <ThemedButton style={styles.loginButton} onPress={handleClick}>
              <ThemedText style={styles.fabText}>
                {isLoading ? "Loading" : "Search"}
              </ThemedText>
            </ThemedButton>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
  },
  itemCenter: {
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#34d399",
    width: "80%",
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    paddingVertical: 10,
    borderRadius: 10,
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  closeButton: {},
});

export default CustomBottomSheetDatePicker;
