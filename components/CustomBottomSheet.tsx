import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { forwardRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import ThemedTextInput from "./ThemedTextInput";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";
export type Ref = BottomSheetModal;

type Props = {
  snapPoints: string[];
  onChange?: (index: number) => void;
  onClosePress: () => void;
};

const CustomBottomSheet = forwardRef<Ref, Props>(
  ({ snapPoints, onChange, onClosePress }, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        enablePanDownToClose={false}
        snapPoints={snapPoints}
        onChange={onChange}
        handleComponent={() => null}
        animationConfigs={{
          duration: 300,
        }}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.modalHeader}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Add Puchase</Text>
            <TouchableOpacity onPress={onClosePress} style={styles.closeButton}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View>
              <ThemedTextInput
                style={styles.input}
                placeholder="Username"
                // value={value}
                // onChangeText={(text) => setValue(text)}
              />
            </View>
            <View>
              <ThemedTextInput
                style={styles.input}
                placeholder="Username"
                // value={value}
                // onChangeText={(text) => setValue(text)}
              />
            </View>
            <View style={[styles.itemCenter, { marginTop: 20 }]}>
              <ThemedButton style={styles.loginButton}>
                <ThemedText style={styles.fabText}>Add</ThemedText>
              </ThemedButton>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  modalContent: {
    padding: 15,
  },
  closeButton: {},
  closeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EDEFF3",
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
});

export default CustomBottomSheet;
